import { JwtPayload } from "jwt-decode"

export type Credentials = {
    username: string,
    password: string,
}

export type AccessTokenClaims = {
    standardClaims: JwtPayload,
    userLevel: UserLevel,
}

export type AuthContextType = {
    username: string | null,
    userLevel: UserLevel,
    persist: boolean,
    login: (username: string, password: string, persist: boolean) => Promise<void>,
    signup: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    refresh: () => Promise<void>,
}

export enum UserLevel {
    GUEST,
    USER,
    ADMIN,
}