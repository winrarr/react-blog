import { HttpStatusCode } from "axios"
import { Auth } from "../@types/auth"
import axios from "../axios/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    return () => {
        setAuth({
            accessToken: "mockAccessToken"
        })
    }
}

export default useRefreshToken