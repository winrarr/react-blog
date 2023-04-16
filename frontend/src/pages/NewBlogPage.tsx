import { newBlog } from "../axios/axiosPrivate"
import { useAuth } from "../context/AuthProvider"
import { useRef } from "react"

const NewBlog = () => {
  const { username } = useAuth()

  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await newBlog({
        id: "",
        title: titleRef.current!.value,
        author: username!,
        body: bodyRef.current!.value,
      })
      alert("success!")
    } catch (error) {
      alert("no success :(")
    }
  }

  return (
    <>
      <form className="new-blog" onSubmit={handleSubmit}>
        <div>
          <label>Blog title</label>
          <input name="title" placeholder="Title" ref={titleRef} /><br />
        </div>
        <label>Blog body</label>
        <textarea name="body" placeholder="Body" /><br />
        <input type="submit" value="Submit" ref={bodyRef} />
      </form>
    </>
  )
}

export default NewBlog