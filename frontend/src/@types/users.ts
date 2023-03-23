import { UserLevel } from "./auth"

// maybe camel case
export interface User {
    Username: string,
    HSPassword: string,
    UserLevel: UserLevel,
    RefreshToken: string,
}