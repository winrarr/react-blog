import axios, { HttpStatusCode } from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Blog } from "../@types/blog"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import MockBlogPosts from "../mock/MockBlogPosts"

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const getBlogs = async () => {
      const response = await axiosPrivate.get<Blog[]>("/blogs")

      if (response.status == HttpStatusCode.Ok) {
        isMounted && setBlogs(response.data)
      } else {
        navigate('/login', { state: { from: location }, replace: true })
      }
    }

    // getBlogs()

    setBlogs(MockBlogPosts)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-page">
      <h1>Blog posts</h1>
      {blogs
        ? (
          // <ul>
          //   {blogs.map((blog, i) =>
          //     <li key={i}>
          //       <article className="blog-post">
          //         <h2>{blog.title}</h2>
          //         <p>{blog.body}</p>
          //       </article>
          //     </li>)}
          // </ul>
          <ul>
            {blogs.map((blog, i) =>
              <li key={1000 * i}>
                <article key={1000 * i + 1} className="blog-post">
                  <h2 key={1000 * i + 2}>{blog.title}</h2>
                  {blog.body.split("\n").map((s, j) => s ? <p key={1000 * i + 3 + j * 2}>{s}</p> : <br key={1000 * i + 3 + j * 2 + 1} />)}
                </article>
              </li>)}
          </ul>
        ) : <p>No blogs posts yet</p>
      }
    </div>
  )
}

export default HomePage