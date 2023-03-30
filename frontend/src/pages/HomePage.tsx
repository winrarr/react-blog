import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Blog } from "../@types/blog"
import { getBlogs } from "../axios/axiosPublic"

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    getBlogs()
      .then(blogs => isMounted && setBlogs(blogs))
      .catch(() => navigate('/login', { state: { from: location }, replace: true }))

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-page">
      <h1>Blog posts</h1>
      {blogs
        ? (
          <ul>
            {blogs.map((blog, i) =>
              <li key={i}>
                <article className="blog-post">
                  <h2>{blog.title}</h2>
                  <p>{blog.body}</p>
                </article>
              </li>)}
          </ul>
        ) : <p>No blogs posts yet</p>
      }
    </div>
  )
}

export default HomePage