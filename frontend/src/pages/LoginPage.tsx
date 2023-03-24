import { ChangeEvent, FormEventHandler, InputHTMLAttributes, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IAuth } from "../@types/auth"
import axios from "../axios/axios"
import useAuth from "../hooks/useAuth"
import { HttpStatusCode } from "axios"
import useInput from "../hooks/useInput"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
}

const FormField = ({ placeholder, ...props }: Props) => (
  <>
    <input className="input" required {...props} />
    <label>{placeholder}</label>
  </>
)

const LoginPage = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [loginUsername, loginUsernameAttr] = useInput()
  const [loginPassword, loginPasswordAttr] = useInput()
  const [signupUsername, signupUsernameAttr] = useInput()
  const [signupPassword1, signupPassword1Attr] = useInput()
  const [signupPassword2, signupPassword2Attr] = useInput()

  const signInValid = () =>
    loginUsername.length > 0 &&
    loginPassword.length > 0

  const signUpValid = () =>
    signupUsername.length > 0 &&
    signupPassword1.length > 0 &&
    signupPassword1 === signupPassword2

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, status } = await axios.post<IAuth>("/login", {
      username: loginUsername,
      password: loginPassword,
    })

    if (status === HttpStatusCode.Ok) {
      setAuth(data)
      navigate(from, { replace: true })
    } else {
      alert("error logging in")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, status } = await axios.post<IAuth>("/signup", {
      username: signupUsername,
      password: signupPassword1,
    })

    if (status === HttpStatusCode.Created) {
      setAuth(data)
      navigate(from, { replace: true })
    } else {
      alert("error signing in")
    }
  }

  return (
    <div className="login-container">

      {/* switch buttons */}
      <input id="login" type="radio" name="item" defaultChecked />
      <label htmlFor="login">Log In</label>

      <input id="signup" type="radio" name="item" />
      <label htmlFor="signup">Sign Up</label>

      <div className="active"></div>

      {/* form */}
      <div className="login-form">

        {/* log in */}
        <form className="login-htm" onSubmit={handleLogin}>
          <FormField placeholder="Username" name="password" {...loginUsernameAttr} />
          <FormField placeholder="Password" name="password" type="password" {...loginPasswordAttr} />
          <input type="submit" value="Sign In" className={`${signInValid() ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        {/* sign up */}
        <form className="signup-htm" onSubmit={handleSignup}>
          <FormField placeholder="Username" name="username" {...signupUsernameAttr} />
          <FormField placeholder="Password" name="password" type="password" {...signupPassword1Attr} />
          <FormField placeholder="Repeat password" type="password" {...signupPassword2Attr} />
          <input type="submit" value="Sign Up" className={`${signUpValid() ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <label htmlFor="sign-in">Already have an account?</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage