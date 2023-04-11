import axios from 'axios'
import { Credentials, LoginResponse, Oauth2Response, UserLevel } from '../@types/auth'
import { Blog } from '../@types/blog'

const baseURL = "http://localhost:8080/"

const axiosPublic = axios.create({
  baseURL,
})

export const signup = (credentials: Credentials) =>
  axiosPublic.post<LoginResponse>("/signup", credentials, {
    withCredentials: true,
  })
    .then(response => response.data)

export const login = async (credentials: Credentials) =>
  axiosPublic.post<LoginResponse>("/login", credentials, {
    withCredentials: true,
  })
    .then(response => response.data)

export const oauth2 = async (token: string) =>
  axiosPublic.get<Oauth2Response>(`/oauth2?token=${token}`, {
    withCredentials: true,
  })
    .then(response => response.data)


export const getBlogs = async () =>
  axiosPublic.get<Blog[]>("/blogs")
    .then(response => response.data)
