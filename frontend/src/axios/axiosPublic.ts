import axios from 'axios'
import { Credentials, UserInfo, UserLevel } from '../@types/auth'
import { Blog } from '../@types/blog'
import { CredentialResponse } from '@react-oauth/google'

const baseURL = "http://localhost:8080/"

const axiosPublic = axios.create({
  baseURL,
})

export const signup = (credentials: Credentials) =>
  axiosPublic.post<UserLevel>("/signup", credentials, {
    withCredentials: true,
  })
    .then(response => response.data)

export const login = async (credentials: Credentials) =>
  axiosPublic.post<UserLevel>("/login", credentials, {
    withCredentials: true,
  })
    .then(response => response.data)

export const oauth2 = async (token: string) =>
  axiosPublic.get<UserInfo>(`/oauth2?token=${token}`, {
    withCredentials: true,
  })
    .then(response => response.data)


export const getBlogs = async () =>
  axiosPublic.get<Blog[]>("/blogs")
    .then(response => response.data)
