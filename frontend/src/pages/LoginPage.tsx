import { useState } from "react"

export default function LoginPage() {
  interface FieldProps {
    placeholder: string,
    type?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  }

  const Field = ({ placeholder, type = "text", onChange }: FieldProps) => (
    <>
      <input
        type={type}
        className="input"
        name={placeholder.toLowerCase()}
        required
        onChange={onChange}
      />
      <label>{placeholder}</label>
    </>
  )

  const [passwords, setPasswords] = useState({
    first: "",
    second: "",
  })

  const passwordChanged1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      first: e.target.value,
    })
  }

  const passwordChanged2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      second: e.target.value,
    })
  }

  return (
    <div className="login-container">

      <input id="sign-in" type="radio" name="item" defaultChecked />
      <label htmlFor="sign-in">Sign In</label>

      <input id="sign-up" type="radio" name="item" />
      <label htmlFor="sign-up">Sign Up</label>

      <div className="active"></div>

      <div className="login-form">
        <form className="sign-in-htm">
          <Field placeholder="Username" />
          <Field placeholder="Password" type="password" value={passwords.first} onChange={passwordChanged1} />
          <input type="submit" value="Sign In" className="submit" />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        <form className="sign-up-htm" action="localhost:8080/signup" method="post">
          <Field placeholder="Username" />
          <Field
            placeholder="Password"
            type="password"
            onChange={passwordChanged1}
          />
          <Field
            placeholder="Repeat password"
            type="password"
            onChange={passwordChanged2}
          />
          <input
            type="submit"
            value="Sign Up"
            className="submit"
          />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  )
}