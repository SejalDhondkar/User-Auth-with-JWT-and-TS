import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.services";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { registerSchema, loginSchema } from "./auth.schema";


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