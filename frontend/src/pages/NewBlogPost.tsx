import { HttpStatusCode } from "axios"
import { blog } from "../@types/blog"
import axios from "../axios/axios"
import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { AccessTokenClaims } from "../@types/auth"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const NewBlogPost = () => {
    const { auth } = useAuth()

    const axiosPrivate = useAxiosPrivate()

    const [title, titleAttr] = useInput()
    const [body, bodyAttr] = useInput()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!auth) {
            alert("you are not an admin, you sneaky bastard")
            return
        }

        const { status } = await axiosPrivate.post<blog>("/newblog", {
            title,
            author: jwt_decode<AccessTokenClaims>(auth.accessToken).standardClaims.sub,
            body,
        })

        if (status === HttpStatusCode.Created) {
            alert("success!")
        } else {
            alert("no success :(")
        }
    }

    return (
        <>
            <iframe name="dummyframe" style={{ display: "none" }} />
            <form onSubmit={handleSubmit}>
                <label>Blog title</label>
                <input placeholder="Blog title" name="title" {...titleAttr} /><br />
                <label>Blog body</label>
                <input placeholder="Blog body" name="body" {...bodyAttr} /><br />
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}

export default NewBlogPost