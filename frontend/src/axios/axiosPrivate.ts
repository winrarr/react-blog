import axios, { HttpStatusCode } from "axios"
import { Blog } from "../@types/blog"
import useAuth from "../hooks/useAuth"

const axiosPrivate = (() => {
  const axiosPrivate = axios.create({
    baseURL: "http://localhost:8080/",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    validateStatus: () => true,
  })

  const { auth } = useAuth()

  axiosPrivate.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${auth?.accessToken}`
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true
        const newAccessToken = await refresh()
        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
        return axiosPrivate(prevRequest)
      }
      return Promise.reject(error)
    }
  )

  const newBlog = async (blog: Blog) => {
    const { status } = await axiosPrivate.post<Blog>("/newblog", blog)
    return status === HttpStatusCode.Created
  }

  const editBlog = async (blog: Blog) => {
    const { status } = await axiosPrivate.put<Blog>("/editblog", blog)
    return status === HttpStatusCode.Ok
  }

  const deleteBlog = async (id: string) => {
    const { status } = await axiosPrivate.delete(`/deleteblog/${id}`)
    return status === HttpStatusCode.Ok
  }

  const logout = async () => {
    const { status } = await axiosPrivate.get("/logout")
    return status === HttpStatusCode.Ok
  }

  return { newBlog, editBlog, deleteBlog, logout }
})()

export default axiosPrivate