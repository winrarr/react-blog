import { useLocation, useNavigate } from "react-router-dom"
import useInput from "../hooks/useInput"
import { InputHTMLAttributes, useState } from 'react'
import { useAuth } from "../context/AuthProvider"
import { GoogleLogin } from "@react-oauth/google"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
}

const FormField = ({ placeholder, ...props }: Props) => (
  <>
    <input className="form-field-input" required {...props} />
    <label className="form-field-label">{placeholder}</label>
  </>
)

const AuthPage = () => {
  const { login, oauth2, signup } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [loginUsername, loginUsernameAttr] = useInput()
  const [loginPassword, loginPasswordAttr] = useInput()
  const [persist, setPersist] = useState(false)
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

    try {
      await login(loginUsername, loginPassword, persist)
      navigate(from, { replace: true })
    } catch (error) {
      alert("error loggin in: " + error)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signup(loginUsername, loginPassword)
      navigate(from, { replace: true })
    } catch (error) {
      alert("error signing up: " + error)
    }
  }

  return (
    <div className="auth-container">

      {/* switch buttons */}
      <input id="login-button" type="radio" name="item" defaultChecked />
      <label htmlFor="login-button">Log In</label>

      <input id="signup-button" type="radio" name="item" />
      <label htmlFor="signup-button">Sign Up</label>

      <div className="active"></div>

      {/* form */}
      <div className="login-form">

        {/* log in */}
        <form className="login-htm" onSubmit={handleLogin}>
          <FormField placeholder="Username" name="password" {...loginUsernameAttr} />
          <FormField placeholder="Password" name="password" type="password" {...loginPasswordAttr} />
          <label className="remember-me">Remember me
            <input type="checkbox" defaultChecked onChange={() => setPersist(!persist)} />
            <span className="checkmark"></span>
          </label>
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

        <GoogleLogin
          width="386"
          onSuccess={credentialResponse => {
            credentialResponse.credential && oauth2(credentialResponse.credential)
            navigate(from, { replace: true })
          }}
          theme="filled_black"
          shape="circle"
          onError={() => {
            console.log('Login Failed')
          }}
          useOneTap
        />

      </div>
    </div>
  )
}

export default AuthPage