import { ChangeEvent, FormEventHandler, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IAuth } from "../@types/auth"
import axios from "../axios/axios"
import useAuth from "../hooks/useAuth"
import { HttpStatusCode } from "axios"

// field component for form
interface FieldProps {
  placeholder: string,
  type?: string,
  name?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const Field = ({ placeholder, type = "text", name, onChange }: FieldProps) => (
  <>
    <input
      type={type}
      className="input"
      name={name}
      required
      onChange={onChange}
    />
    <label>{placeholder}</label>
  </>
)

// form
const LoginPage = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [loginUsername, setloginUsername] = useState("")
  const [loginPassword, setloginPassword] = useState("")
  const [signupUsername, setsignupUsername] = useState("")
  const [signupPassword1, setsignupPassword1] = useState("")
  const [signupPassword2, setsignupPassword2] = useState("")

  const signInValid = loginUsername.length > 0 && loginPassword.length > 0
  const signUpValid = signupUsername.length > 0 && signupPassword1.length > 0 && signupPassword1 == signupPassword2

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, status } = await axios.post<IAuth>("/login", {
      username: loginUsername,
      password: loginPassword,
    })

    if (status == HttpStatusCode.Ok) {
      setAuth(data)
      navigate(from, { replace: true })
    } else {
      alert("error signing in")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, status } = await axios.post<IAuth>("/signup", {
      username: signupUsername,
      password: signupPassword1,
    })

    if (status == HttpStatusCode.Created) {
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

        {/* remove form redirect */}
        <iframe name="dummyframe" />

        {/* log in */}
        <form className="login-htm" onSubmit={handleLogin}>
          <Field placeholder="Username" name="password" onChange={e => setloginUsername(e.target.value)} />
          <Field placeholder="Password" type="password" name="password" onChange={e => setloginPassword(e.target.value)} />
          <input type="submit" value="Sign In" className={`submit ${signInValid ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        {/* sign up */}
        <form className="signup-htm" onSubmit={handleSignup}>
          <Field placeholder="Username" name="username" onChange={e => setsignupUsername(e.target.value)} />
          <Field placeholder="Password" type="password" name="password" onChange={e => setsignupPassword1(e.target.value)} />
          <Field placeholder="Repeat password" type="password" onChange={e => setsignupPassword2(e.target.value)} />
          <input type="submit" value="Sign Up" className={`submit ${signUpValid ? "" : "invalid"}`} />

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