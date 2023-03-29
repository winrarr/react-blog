import { JwtPayload } from "jwt-decode";
import { Dispatch, SetStateAction } from "react";

export type Credentials = {
    username: string,
    password: string,
}

export type Auth = {
    accessToken: string,
}

export type AccessTokenClaims = {
    standardClaims: JwtPayload,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: Auth | null,
    setAuth: Dispatch<SetStateAction<Auth | null>>,
    persist: boolean,
    setPersist: (dispatcher: (prev: boolean) => boolean) => void,
}

export enum UserLevel {
    GUEST,
    USER,
    ADMIN,
}