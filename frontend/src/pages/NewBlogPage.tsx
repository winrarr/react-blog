import { HttpStatusCode } from "axios"
import { Blog } from "../@types/blog"
import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"
import jwt_decode from 'jwt-decode'
import { AccessTokenClaims } from "../@types/auth"
import { newBlog } from "../axios/axiosPrivate"

const NewBlog = () => {
    const { auth } = useAuth()

    const [title, titleAttr] = useInput()
    const [body, bodyAttr] = useInput()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!auth) {
            alert("you are not an admin, you sneaky bastard")
            return
        }

        const ok = await newBlog({
            title,
            author: jwt_decode<AccessTokenClaims>(auth.accessToken).standardClaims.sub || "",
            body,
        })

        ok ? alert("success!") : alert("no success :(")
    }

    return (
        <>
            <iframe name="dummyframe" style={{ display: "none" }} />
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