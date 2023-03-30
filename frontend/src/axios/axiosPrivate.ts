import axios, { HttpStatusCode } from 'axios'
import { Blog } from '../@types/blog'

const baseURL = "http://localhost:8080/"

const axiosPrivate = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  validateStatus: () => true,
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

export const refresh = async () => {
  await axiosPrivate.get("/refresh")
}

export const logout = async () => {
  await axiosPrivate.get("/logout")
}

export const newBlog = (blog: Blog) => {
  return axiosPrivate.post("/newblog", blog)
}