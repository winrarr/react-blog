import { JwtPayload } from "jwt-decode";
import { Dispatch, SetStateAction } from "react";

export interface AccessTokenClaims {
    standardClaims: JwtPayload,
    userLevel: UserLevel,
}

export interface IAuth {
    accessToken: string,
    refreshToken: string,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: IAuth | null,
    setAuth: Dispatch<SetStateAction<IAuth | null>>,
    clearAuth: () => void,
}

export enum UserLevel {
    Guest,
    User,
    Admin,
}