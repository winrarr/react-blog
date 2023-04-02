import { useState, useEffect, MouseEventHandler, EventHandler, FormEventHandler, FormEvent } from "react"
import { Blog } from "../@types/blog"
import { deleteBlog, editBlog } from "../axios/axiosPrivate"
import { getBlogs } from "../axios/axiosPublic"
import useInput from "../hooks/useInput"

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

  const handleEdit: ((index: number, title: string, body: string) => MouseEventHandler<HTMLButtonElement>) = (index, title, body) => () => {
    setEditing(index)
    setTitle(title)
    setBody(body)
  }

  const handleSubmit: ((id: string, author: string) => MouseEventHandler<HTMLButtonElement>) = (id: string, author: string) => () => {
    title && body &&
      editBlog({
        id,
        title,
        author,
        body,
      })

    setEditing(null)
  }

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
                <div className="blog-post">
                  <div>
                    <label>Blog title</label>
                    <input name="title" disabled={editing !== i} defaultValue={blog.title} onChange={e => setTitle(e.target.value)} /><br />
                  </div>
                  <label>Blog body</label>
                  <textarea name="body" disabled={editing !== i} defaultValue={blog.body} onChange={e => setBody(e.target.value)} /><br />
                  {editing === i
                    ? <button type="submit" onClick={handleSubmit(blog.id, blog.author)}>Save</button>
                    : <button type="button" onClick={handleEdit(i, blog.title, blog.body)}>Edit</button>}
                  <button type="button" onClick={handleDelete(blog.id)}>Delete</button>
                </div>
              </li>)}
          </ul>)
      }
    </div >
  )
}

export default Admin