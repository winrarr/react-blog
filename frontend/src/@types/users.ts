import { UserLevel } from "./auth"

export interface User {
    Username: string,
    HSPassword: string,
    UserLevel: UserLevel,
    RefreshToken: string,
}