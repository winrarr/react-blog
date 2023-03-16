import { useState } from "react"

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

export default function LoginPage() {

  const [passwords, setPasswords] = useState({
    first: "",
    second: "",
  })

  const passIsValid = passwords.first.length > 0 && passwords.first == passwords.second

  const passwordChanged = (variable: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords({
      ...passwords,
      [variable]: e.target.value,
    })

  return (
    <div className="login-container">

      {/* switch buttons */}
      <input id="sign-in" type="radio" name="item" defaultChecked />
      <label htmlFor="sign-in">Sign In</label>

      <input id="sign-up" type="radio" name="item" />
      <label htmlFor="sign-up">Sign Up</label>

      <div className="active"></div>

      {/* form */}
      <div className="login-form">

        {/* remove form redirect */}
        <iframe name="dummyframe" />

        {/* sign in */}
        <form className="sign-in-htm">
          <Field placeholder="Username" name="password" />
          <Field placeholder="Password" type="password" name="password" />
          <input type="submit" value="Sign In" className="submit" />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        {/* sign up */}
        <form className="sign-up-htm" action="http://localhost:8080/signup" method="post" target="dummyframe">
          <Field placeholder="Username" name="username" />
          <Field placeholder="Password" type="password" name="password" onChange={passwordChanged("first")} />
          <Field placeholder="Repeat password" type="password" onChange={passwordChanged("second")} />
          <input type="submit" value="Sign Up" className={`submit ${passIsValid ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <label htmlFor="sign-in">Already have an account?</label>
          </div>
        </form>
      </div>
    </div>
  )
}