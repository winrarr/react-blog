import { Auth } from "../@types/auth"
import axios from "../axios/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    return async () => {
        const response = await axios.get<Auth>('/refresh', {
            withCredentials: true
        })
        setAuth(response.data)
    }
}

export default useRefreshToken