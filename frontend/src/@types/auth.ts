import { JwtPayload } from "jwt-decode"
import { Dispatch, SetStateAction } from "react"

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
    setUsername: Dispatch<SetStateAction<string | null>>,
    userLevel: UserLevel,
    setUserLevel: Dispatch<SetStateAction<UserLevel>>,
    persist: boolean,
    setPersist: Dispatch<React.SetStateAction<boolean>>,
}

export enum UserLevel {
    GUEST,
    USER,
    ADMIN,
}