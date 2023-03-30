import { useState, useEffect } from "react"
import { Blog } from "../@types/blog"
import { getBlogs } from "../axios/axiosPublic"

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    let isMounted = true

    getBlogs()
      .then(blogs => isMounted && setBlogs(blogs))

    return () => { isMounted = false }
  }, [])

  return (
    <div className="home-page">
      <h1>Blog posts</h1>
      {!blogs
        ? <p>No blogs posts yet</p>
        : (
          <ul>
            {blogs.map((blog, i) =>
              <li key={i}>
                <article className="blog-post">
                  <h2>{blog.title}</h2>
                  <p>{blog.body}</p>
                </article>
              </li>)}
          </ul>)
      }
    </div>
  )
}

export default HomePage