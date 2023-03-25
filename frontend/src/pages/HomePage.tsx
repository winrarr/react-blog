import axios, { HttpStatusCode } from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Blog } from "../@types/blog"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    let source = axios.CancelToken.source()

    const getBlogs = async () => {
      const response = await axiosPrivate.get<Blog[]>("/blogs", {
        cancelToken: source.token,
      })

      if (response.status == HttpStatusCode.Ok) {
        isMounted && setBlogs(response.data)
      } else {
        navigate('/login', { state: { from: location }, replace: true })
      }
    }

    getBlogs()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <article>
      <h2>Blog posts</h2>
      {blogs
        ? (
          <ul>
            {blogs.map((blog, i) => <li key={i}>{JSON.stringify(blog)}</li>)}
          </ul>
        ) : <p>No blogs to display</p>
      }
    </article>
  )
}

export default HomePage