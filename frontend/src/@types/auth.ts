import { Dispatch, SetStateAction } from "react";

export interface IAuth {
    accessToken: string,
    refreshToken: string,
    UserLevel: UserLevel,
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