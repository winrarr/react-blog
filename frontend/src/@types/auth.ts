import { JwtPayload } from "jwt-decode";
import { Dispatch, SetStateAction } from "react";

export type Auth = {
    accessToken: string,
}

export interface AccessTokenClaims {
    standardClaims: JwtPayload,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: Auth | null,
    setAuth: Dispatch<SetStateAction<Auth | null>>,
    clearAuth: () => void,
    persist: boolean,
    setPersist: (dispatcher: (prev: boolean) => boolean) => void,
}

export enum UserLevel {
    Guest,
    User,
    Admin,
}