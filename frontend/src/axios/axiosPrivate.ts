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
    const prevRequest = error?.config
    if (error?.response?.status === HttpStatusCode.Forbidden && !prevRequest?.sent) {
      prevRequest.sent = true
      await refresh()
      return axiosPrivate(prevRequest)
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