export interface IAuth {
    session: string,
    userLevel: UserLevel,
}

export type AuthContextType = {
    auth: IAuth,
    setAuth: (auth: IAuth) => void,
}

export enum UserLevel {
    Guest,
    User,
    Admin,
}