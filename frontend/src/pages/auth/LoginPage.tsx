import { GoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import { useAuth } from "../../context/AuthProvider"
import FormField from "../../components/FormField"
import Checkbox from "../../components/Checkbox"
import Hr from "../../components/Hr"
import { useLocation, useNavigate } from "react-router-dom"
import useInput from "../../hooks/useInput"
import useToggle from "../../hooks/useToggle"
import useToggleCheckbox from "../../hooks/useToggleCheckbox"

const LoginPage = () => {
  const { login, oauth2 } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [username, usernameAttr] = useInput()
  const [password, passwordAttr] = useInput()

  const [persist, persistAttr] = useToggleCheckbox(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await login(username, password, persist)
    navigate(from, { replace: true })
  }

  return (
    <>
      <form className="auth-container"
        onSubmit={handleSubmit}
      >
        <h1>Log in</h1>
        <FormField
          name="username"
          required
          minLength={5}
          maxLength={16}
          placeholder={"Username"}
          marginBottom={20}
          {...usernameAttr}
        />
        <FormField
          type="password"
          name="password"
          required
          minLength={6}
          maxLength={50}
          placeholder="Password"
          marginBottom={20}
          {...passwordAttr}
        />
        <Checkbox
          label="Remember me"
          marginBottom={20}
          {...persistAttr}
        />
        <input type="submit" value="Log in" />

        <Hr marginBottom={20} />

        <GoogleLogin
          onSuccess={credentialResponse => {
            credentialResponse.credential && oauth2(credentialResponse.credential)
          }}
          useOneTap
          theme="filled_black"
          shape="circle"
          containerProps={{ style: { lineHeight: 2 } }}
        />
      </form>
    </>
  )
}

export default LoginPage