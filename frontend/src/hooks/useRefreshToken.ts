import { HttpStatusCode } from "axios"
import { Auth } from "../@types/auth"
import axios from "../axios/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    return async () => {
        const { data, status } = await axios.get<Auth>('/refresh', {
            withCredentials: true,
        })
        status === HttpStatusCode.Ok && setAuth(data)
    }
}

export default useRefreshToken