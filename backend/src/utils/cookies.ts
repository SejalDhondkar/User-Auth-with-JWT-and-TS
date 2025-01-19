import { CookieOptions,Response } from "express"
import { NODE_ENV } from "../constants/env";
import { fifteenMunitesFromNow, thirtyDaysFromNow } from "./date";


const secure = NODE_ENV !== 'development';

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure
};

const getAccessTokenCookieOptions = ():CookieOptions => ({
    ...defaults,
    expires: fifteenMunitesFromNow()
});

const getRefreshTokenCookieOptions = ():CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow()
});

type Params = {
    res: Response;
    accessToken: String;
    refreshToken: String
}

export const setAuthCookies = ({res, accessToken, refreshToken}:Params )=> 
    res.cookie('ACCESS-TOKEN', accessToken, getAccessTokenCookieOptions())
    .cookie('REFRESH-TOKEN', refreshToken, getRefreshTokenCookieOptions())
