import { newBlog } from "../axios/axiosPrivate"
import { useAuth } from "../context/AuthProvider"
import { useRef } from "react"

const NewBlog = () => {
  const { username } = useAuth()

  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

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
        <label>Blog title:</label>
        <input name="title" placeholder="Title" ref={titleRef} /><br />
        <label>Blog body:</label>
        <textarea name="body" placeholder="Body" ref={bodyRef} /><br />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

export default NewBlog