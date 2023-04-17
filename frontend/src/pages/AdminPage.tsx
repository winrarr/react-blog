import { useState, useEffect, MouseEventHandler } from "react"
import { Blog } from "../@types/blog"
import { deleteBlog, editBlog } from "../axios/axiosPrivate"
import { getBlogs } from "../axios/axiosPublic"

const Admin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    let isMounted = true

    getBlogs()
      .then(blogs => isMounted && setBlogs(blogs))

    return () => { isMounted = false }
  }, [])

  const [editing, setEditing] = useState<number | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)

  const handleEdit: ((index: number, title: string, body: string) => MouseEventHandler<HTMLInputElement>) = (index, title, body) => () => {
    setEditing(index)
    setTitle(title)
    setBody(body)
  }

  const handleSubmit: ((id: string, author: string) => MouseEventHandler<HTMLInputElement>) = (id: string, author: string) => () => {
    title && body &&
      editBlog({
        id,
        title,
        author,
        body,
      })

    setEditing(null)
  }

  const handleDelete: ((id: string) => MouseEventHandler<HTMLInputElement>) = id => () => {
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
                <div className="blog-post">
                  <label>Blog title:</label>
                  <input name="title" disabled={editing !== i} defaultValue={blog.title} onChange={e => setTitle(e.target.value)} /><br />
                  <label>Blog body:</label>
                  <textarea name="body" disabled={editing !== i} defaultValue={blog.body} onChange={e => setBody(e.target.value)} /><br />
                  {editing === i
                    ? <input type="submit" onClick={handleSubmit(blog.id, blog.author)} value="Save" />
                    : <input type="submit" onClick={handleEdit(i, blog.title, blog.body)} value="Edit" />}
                  <input type="submit" onClick={handleDelete(blog.id)} value="Delete" className="danger" />
                </div>
              </li>)}
          </ul>)
      }
    </div >
  )
}

export default Admin