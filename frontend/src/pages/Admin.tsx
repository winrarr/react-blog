import { useState, useEffect, MouseEventHandler, EventHandler } from "react"
import { Blog } from "../@types/blog"
import { deleteBlog } from "../axios/axiosPrivate"
import { getBlogs } from "../axios/axiosPublic"

const Admin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    let isMounted = true

    getBlogs()
      .then(blogs => isMounted && setBlogs(blogs))

    return () => { isMounted = false }
  }, [])

  // const handleEdit: ((id: string) => MouseEventHandler<HTMLButtonElement>) = id => () => {
  //   return deleteBlog(id)
  //     .then(() => alert("success!"))
  //     .catch(() => alert("no success :("))
  // }

  const handleDelete: ((id: string) => MouseEventHandler<HTMLButtonElement>) = id => () => {
    return deleteBlog(id)
      .then(() => alert("success!"))
      .catch(() => alert("no success :("))
  }

  return (
    <div className="admin-page">
      <h1>Blogs</h1>
      {!blogs
        ? <p>No blogs posts yet</p>
        : (
          <ul>
            {blogs.map((blog, i) =>
              <li key={i}>
                <article className="blog-post">
                  <h2>{blog.title}</h2>
                  <p>{blog.body}</p>
                  {/* <button onClick={handleEdit(blog.id)}>Edit</button> */}
                  <button onClick={handleDelete(blog.id)}>Delete</button>
                </article>
              </li>)}
          </ul>)
      }
    </div>
  )
}

export default Admin