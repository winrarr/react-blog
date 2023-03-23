import { useEffect } from "react"
import { axiosPrivate } from "../axios/axios"
import useAuth from "./useAuth"
import useRefreshToken from "./useRefreshToken"

const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const { auth } = useAuth()

    useEffect(() => {
        
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            // try null coalescence or something
            config => {
                config.headers['Authorization'] ??= `Bearer ${auth?.accessToken}`
                if (!config.headers['Authorization']) {
                    // check this
                    console.log(auth?.accessToken)
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor)
            axiosPrivate.interceptors.response.eject(responseInterceptor)
        }
    }, [auth, refresh])

    return axiosPrivate
}

export default useAxiosPrivate