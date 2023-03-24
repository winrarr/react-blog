import { JwtPayload } from "jwt-decode";
import { Dispatch, SetStateAction } from "react";

export type AuthResponse = {
    accessToken: string,
    userLevel: UserLevel,
}

export interface AccessTokenClaims {
    standardClaims: JwtPayload,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: AuthResponse | null,
    setAuth: Dispatch<SetStateAction<AuthResponse | null>>,
    clearAuth: () => void,
    persist: boolean,
    setPersist: (dispatcher: (prev: boolean) => boolean) => void,
}

export enum UserLevel {
    Guest,
    User,
    Admin,
}