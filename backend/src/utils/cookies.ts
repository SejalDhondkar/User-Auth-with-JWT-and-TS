import { CookieOptions,Response } from "express"
import { NODE_ENV } from "../constants/env";
import { fifteenMunitesFromNow, thirtyDaysFromNow } from "./date";


const secure = NODE_ENV !== 'development';

export const REFRESH_PATH = '/auth/refresh';

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure
};

export const getAccessTokenCookieOptions = ():CookieOptions => ({
    ...defaults,
    expires: fifteenMunitesFromNow()
});

export const getRefreshTokenCookieOptions = ():CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH
});

type Params = {
    res: Response;
    accessToken: String;
    refreshToken: String
}

export const setAuthCookies = ({res, accessToken, refreshToken}:Params )=> 
    res.cookie('ACCESS-TOKEN', accessToken, getAccessTokenCookieOptions())
    .cookie('REFRESH-TOKEN', refreshToken, getRefreshTokenCookieOptions())

export const clearAuthCookies = (res: Response) => 
    res.clearCookie('ACCESS-TOKEN').clearCookie('REFRESH-TOKEN',{
        path: REFRESH_PATH
    });
