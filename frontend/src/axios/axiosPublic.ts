import axios from 'axios'
import { Credentials, UserLevel } from '../@types/auth'
import { Blog } from '../@types/blog'

const baseURL = "http://localhost:8080/"

const axiosPublic = axios.create({
  baseURL,
  validateStatus: () => true,
})

export const signup = (credentials: Credentials) => {
  return axiosPublic.post<UserLevel>("/signup", credentials, {
    withCredentials: true,
  })
}

export const login = (credentials: Credentials) => {
  return axiosPublic.post<UserLevel>("/login", credentials, {
    withCredentials: true,
  })
}

export const getBlogs = async () => {
  return axiosPublic.get<Blog[]>("/blogs")
    .then(response => response.data)
}