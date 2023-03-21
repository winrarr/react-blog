import axios from "../axios/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    return async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })
        setAuth(prev => prev? { ...prev, accessToken: response.data.accessToken } : null)
        return response.data.accessToken
    }
}

export default useRefreshToken