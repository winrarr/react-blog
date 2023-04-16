import { GoogleLogin } from "@react-oauth/google"
import { useRef } from "react"
import { useAuth } from "../../context/AuthProvider"
import Checkbox from "../../components/Checkbox"
import Hr from "../../components/Hr"
import { useLocation, useNavigate } from "react-router-dom"

const LoginPage = () => {
  const { signup, oauth2 } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const persistRef = useRef<HTMLInputElement>(null)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await signup(usernameRef.current!.value, passwordRef.current!.value)
    navigate(from, { replace: true })
  }

  return (
    <>
      <form className="auth-container"
        onSubmit={handleSubmit}
      >
        <h1>Sign up</h1>
        <label>Username:</label>
        <input
          name="username"
          placeholder="Username"
          required
          minLength={5}
          maxLength={16}
          ref={usernameRef}
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          maxLength={50}
          ref={passwordRef}
        />
        <Checkbox
          label="Remember me"
          innerRef={persistRef}
        />
        <input type="submit" value="Log in" />

        <Hr marginBottom={20} />

        <GoogleLogin
          onSuccess={credentialResponse => {
            credentialResponse.credential && oauth2(credentialResponse.credential)
          }}
          useOneTap
          theme="filled_blue"
          shape="circle"
          containerProps={{ style: { lineHeight: 2 } }}
        />
      </form>
    </>
  )
}

export default LoginPage