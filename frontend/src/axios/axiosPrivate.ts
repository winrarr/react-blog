import axios, { HttpStatusCode } from 'axios'
import { Blog } from '../@types/blog'

const baseURL = "http://localhost:8080/"

const axiosPrivate = axios.create({
  baseURL,
  withCredentials: true,
})

axiosPrivate.interceptors.response.use(
  response => response,
  async (error) => {
    const originalConfig = error.config
    if (error?.response.status === HttpStatusCode.Forbidden && !originalConfig._retry) {
      originalConfig._retry = true
      await refresh()
      return axiosPrivate(originalConfig)
    }
    return Promise.reject(error)
  }
)

export const refresh = async () =>
  axiosPrivate.get("/refresh")


export const logout = async () => 
  axiosPrivate.get("/logout")


export const newBlog = (blog: Blog) =>
  axiosPrivate.post("/newblog", blog)