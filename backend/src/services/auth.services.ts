import { APP_ORIGIN } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import { VerificationCodeTypes } from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneDayFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { getVerifyEmailTemplate } from "../utils/emailTemplates";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";

export type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
}


export const createAccount = async (data: CreateAccountParams) => {
    // verify existing user doesnt exist
    const existingUser = await UserModel.exists({
        email: data.email,
    });

    appAssert(!existingUser,CONFLICT,'Email Already in Use');

    // create user
    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    });

    const userId = user._id;

    // create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: oneYearFromNow(),
    });

    // send verification email
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
    await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url)
    });

    // create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent
    });

    // sign access token & refresh token
    const refreshToken = signToken(
        { sessionId: session._id},
        refreshTokenSignOptions
    )
    
    const accessToken = signToken({
        userId,
        sessionId: session._id
    });

    // return user
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }
};

export type LoginParams = {
    email: string;
    password: string,
    userAgent?: string;
}

export const loginUser = async ({
    email,
    password,
    userAgent
}: LoginParams) => {
    // check if user exists
    const user = await UserModel.findOne({email});
    appAssert(user,UNAUTHORIZED,'Invalid Email or Password');

    const userId = user._id;

    //validate the password
    const passwordCheck = await user.comparePassword(password);
    appAssert(passwordCheck, UNAUTHORIZED, 'Invalid Email or Password');

    // create session
    const session = await SessionModel.create({
        userId,
        userAgent
    });

    const sessionInfo = {
        sessionId: session._id
    }

    // sign refresh and access tokens
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

    const accessToken = signToken({
        ...sessionInfo,
        userId
    });

    // return success 
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };

};

export const refreshUserAccessToken = async (RefreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(RefreshToken, refreshTokenSignOptions);
    appAssert(payload,UNAUTHORIZED,'Invalid Refresh Token');

    // check if session exists in DB
    const session = await SessionModel.findById(payload.sessionId);

    //check if session not exists in DB or session is expired
    const now = Date.now();
    appAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        'Session expired'
    );

    // refresh token if it is to expire in next 24hrs/1day
    const sessionNeedRefresh = session.expiresAt.getTime() - now <= oneDayFromNow();
    if(sessionNeedRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedRefresh
        ? signToken({
            sessionId: session._id
        },
        refreshTokenSignOptions
    ) : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id
    });

    return {
        accessToken,
        newRefreshToken
    }
};


export const verifyEmail = async (code: string) => {
    // get the verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: { $gt: new Date() }
    });
    appAssert(validCode, NOT_FOUND, 'Invalid or Expired Verification Code');

    // get the user by id and update the user verifed to true
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId, {
            verified: true
        },
        { new: true }
    );
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');

    // delete verification code
    await validCode.deleteOne();

    // return user
    return {
        user: updatedUser.omitPassword()
    };
}