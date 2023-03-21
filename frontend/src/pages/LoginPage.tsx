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

  interface stateType {
    loginUsername: string,
    loginPassword: string,
    signupUsername: string,
    signupPassword1: string,
    signupPassword2: string,
  }

  const reducer = (state: stateType, action: { variable: string, value: string }) => ({
    ...state,
    [action.variable]: action.value,
  })

  const initialState: stateType = {
    loginUsername: "",
    loginPassword: "",
    signupUsername: "",
    signupPassword1: "",
    signupPassword2: "",
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const fieldChanged = (variable: string) => (e: ChangeEvent<HTMLInputElement>) =>
    dispatch({
      variable,
      value: e.target.value,
    })

  const signInValid = state.loginUsername.length > 0 && state.loginPassword.length > 0
  const signUpValid = state.signupUsername.length > 0 && state.signupPassword1.length > 0 && state.signupPassword1 == state.signupPassword2

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, status } = await axios.post<IAuth>("/login", {
      username: state.loginUsername,
      password: state.loginPassword,
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
      username: state.signupUsername,
      password: state.signupPassword1,
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

        {/* sign in */}
        <form className="login-htm" onSubmit={handleLogin}>
          <Field placeholder="Username" name="password" onChange={fieldChanged("loginUsername")} />
          <Field placeholder="Password" type="password" name="password" onChange={fieldChanged("loginPassword")} />
          <input type="submit" value="Sign In" className={`submit ${signInValid ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        {/* sign up */}
        <form className="signup-htm" onSubmit={handleSignup}>
          <Field placeholder="Username" name="username" onChange={fieldChanged("signupUsername")} />
          <Field placeholder="Password" type="password" name="password" onChange={fieldChanged("signupPassword1")} />
          <Field placeholder="Repeat password" type="password" onChange={fieldChanged("signupPassword2")} />
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