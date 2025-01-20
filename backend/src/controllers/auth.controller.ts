import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.services";
import { CREATED, OK } from "../constants/http";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { registerSchema, loginSchema } from "./auth.schema";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";


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