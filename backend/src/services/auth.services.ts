import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/http";
import { VerificationCodeTypes } from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

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

    // if(existingUser) {
    //     throw new Error('User already exists');
    // }

    appAssert(!existingUser,CONFLICT,'Email Already in Use');

    // create user
    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    });

    // create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: oneYearFromNow(),
    });

    // send verification email

    // create session
    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent
    });

    // sign access token & refresh token
    const refreshToken = jwt.sign(
        { sessionId: session._id},
        JWT_REFRESH_SECRET,
        {
            audience: ['user'],
            expiresIn: '30d',
        }
    );

    const accessToken = jwt.sign(
        {   userId: user._id,
            sessionId: session._id},
        JWT_SECRET,
        {
            audience: ['user'],
            expiresIn: '15m',
        }
    );

    // return user
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }
}