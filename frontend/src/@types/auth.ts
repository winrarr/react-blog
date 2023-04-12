import { CredentialResponse } from "@react-oauth/google"
import { JwtPayload } from "jwt-decode"

// internal
export type AuthContextType = {
    username: string | null,
    userLevel: UserLevel,
    persist: boolean,
    login: (username: string, password: string, persist?: boolean) => Promise<void>,
    oauth2: (token: string) => Promise<void>,
    signup: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    refresh: () => Promise<void>,
}

export enum UserLevel {
    GUEST,
    USER,
    ADMIN,
}

// request
export type Credentials = {
    username: string,
    password: string,
}

// response
export type AuthResponse = {
    username: string,
    userLevel: UserLevel,
}