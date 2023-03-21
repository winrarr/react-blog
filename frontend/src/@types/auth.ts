export interface IAuth {
    session: string,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: IAuth | null,
    setAuth: (auth: IAuth) => void,
    clearAuth: () => void,
}

export enum UserLevel {
    Guest,
    User,
    Admin,
}