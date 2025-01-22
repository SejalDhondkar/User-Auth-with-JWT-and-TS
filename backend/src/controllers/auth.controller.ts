import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.services";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies";
import { registerSchema, loginSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } from "./auth.schema";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";


export const registerHandler = catchErrors(async (req, res) => {
    // validate the request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    //call the services
    const { user, refreshToken, accessToken} = await createAccount(request);

    // return response 

    return setAuthCookies({res, accessToken, refreshToken})
    .status(CREATED).json(user);
});

export const loginHandler = catchErrors(async(req,res)=> {
    // validate the requst
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    // call the service

    const {user, refreshToken, accessToken} = await loginUser(request);

    // return response
    return setAuthCookies({res, accessToken, refreshToken})
    .status(OK).json(user);

})

export const logoutHandler = catchErrors(async(req,res)=> {
    // verify the token from cookies
    const accessToken = req.cookies['ACCESS-TOKEN'];

    const { payload } = verifyToken(accessToken);

    // delete the session from db
    if(payload){
    await SessionModel.findByIdAndDelete(payload.sessionId);    
    }

    // delete the cookies from res
    return clearAuthCookies(res)
    .status(OK).json({
        message: 'Logout successful'
    });    
});


export const refreshHandler = catchErrors(async(req,res)=> {
    // verify the refresh token from cookies
    const refreshToken = req.cookies['REFRESH-TOKEN'];
    appAssert(refreshToken,UNAUTHORIZED,'Refresh Token missing');

    // generate the new access & refresh token
    const {accessToken, newRefreshToken} = await refreshUserAccessToken(refreshToken);

    // set the refresh token if exists
    if(newRefreshToken){
        res.cookie('REFRESH-TOKEN',newRefreshToken,getRefreshTokenCookieOptions());
    }

    return res.cookie('ACCESS-TOKEN', accessToken, getAccessTokenCookieOptions())
        .status(200).json({
            message: 'Access token refreshed'
        });
});

export const verifyEmailHandler = catchErrors(async(req,res)=> {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    return res.status(OK).json({
        message: 'Email was successfully verified'
    })
});

export const sendPasswordResetHandler = catchErrors(async(req,res)=> {
    const email = emailSchema.parse(req.body.email);

    await sendPasswordResetEmail(email);

    return res.status(OK).json({
        message: 'Password reset email sent'
    })
});

export const ResetPasswordHandler = catchErrors(async(req,res)=>{
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    return clearAuthCookies(res).status(OK).json({
        message: 'Password reset successfully'
    });
});