import { useLocation, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"
import FormField from "../components/FormField"
import { login, signup } from "../axios/axiosPublic"

const AuthPage = () => {
  const { setUserLevel, setUsername, setPersist } = useAuth()

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

    login({
      username: loginUsername,
      password: loginPassword,
    })
      .then(userLevel => {
        setUsername(loginUsername)
        setUserLevel(userLevel.data)
        navigate(from, { replace: true })
      })
      .catch(() => alert("error signing in"))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    signup({
      username: signupUsername,
      password: signupPassword1,
    })
      .then(userLevel => {
        setUsername(signupUsername)
        setUserLevel(userLevel.data)
        navigate(from, { replace: true })
      })
      .catch(() => alert("error signing in"))
  }

  const togglePersist = () => {
    setPersist(prev => !prev)
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
            <input type="checkbox" defaultChecked onChange={togglePersist} />
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
      </div>
    </div>
  )
}

export default AuthPage