import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"
import { newBlog } from "../axios/axiosPrivate"

const NewBlog = () => {
  const { username } = useAuth()

  const [title, titleAttr] = useInput()
  const [body, bodyAttr] = useInput()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    newBlog({
      id: "",
      title,
      author: username || "",
      body,
    })
      .then(() => alert("success!"))
      .catch(() => alert("no success :("))
  }

  return (
    <>
      <form className="new-blog" onSubmit={handleSubmit}>
        <div>
          <label>Blog title</label>
          <input name="title" {...titleAttr} /><br />
        </div>
        <label>Blog body</label>
        <textarea name="body" {...bodyAttr} /><br />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

export default NewBlog