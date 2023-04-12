import axios, { HttpStatusCode } from 'axios'
import { LoginResponse, UserLevel } from '../@types/auth'
import { Blog } from '../@types/blog'

const baseURL = "http://localhost:8080/"

const axiosPrivate = axios.create({
  baseURL,
  withCredentials: true,
})

axiosPrivate.interceptors.response.use(
  response => response,
  async (error) => {
    const prevRequest = error.config
    if (error?.response.status === HttpStatusCode.Forbidden && prevRequest.url !== "/refresh") {
      await refresh()
      return axiosPrivate(prevRequest)
    }
    return Promise.reject(error)
  }
)

export const refresh = () =>
  axiosPrivate.get<LoginResponse>("/refresh")
    .then(response => response.data)


export const logout = () =>
  axiosPrivate.get("/logout")

export const newBlog = (blog: Blog) =>
  axiosPrivate.post("/newblog", blog)

export const deleteBlog = (id: string) =>
  axiosPrivate.delete(`/deleteblog/${id}`)

export const editBlog = (blog: Blog) =>
  axiosPrivate.put("/editblog", blog)