import axios, { HttpStatusCode } from 'axios'
import { Auth, Credentials } from '../@types/auth'
import { Blog } from '../@types/blog'
import useAuth from '../hooks/useAuth'

const axiosPublic = axios.create({
    baseURL: "http://localhost:8080/",
    validateStatus: () => true,
})

export const getBlogs = async () => {
    const { data, status } = await axiosPublic.get<Blog[]>("/blogs")
    return status === HttpStatusCode.Ok ? data : null
}

const { setAuth } = useAuth()

export const signup = async (credentials: Credentials) => {
    const { data, status } = await axiosPublic.post<Auth>("/signup", credentials, {
        withCredentials: true,
    })
    if (status === HttpStatusCode.Created) {
        setAuth(data)
        return true
    } else {
        return false
    }
}

export const login = async (credentials: Credentials) => {
    const { data, status } = await axiosPublic.post<Auth>("/login",credentials, {
        withCredentials: true,
    })
    if (status === HttpStatusCode.Created) {
        setAuth(data)
        return true
    } else {
        return false
    }
}

export const refresh = async () => {
    const { data, status } = await axiosPublic.get<Auth>("/refresh", {
        withCredentials: true,
    })
    status === HttpStatusCode.Ok && setAuth(data)
  }