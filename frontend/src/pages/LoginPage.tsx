export default function () {
  interface FieldProps {
    placeholder: string,
    type?: string,
  }

  const Field = ({ placeholder, type = "text" }: FieldProps) => (
    <>
      <input type={type} className="input" />
      <label>{placeholder}</label>
    </>
  )

  return (
    <div className="login-container">

      <input id="sign-in" type="radio" name="item" checked />
      <label htmlFor="sign-in">Sign In</label>

      <input id="sign-up" type="radio" name="item" />
      <label htmlFor="sign-up">Sign Up</label>

      <div className="active"></div>

      <div className="login-form">
        <form className="sign-in-htm">
          <Field placeholder="Username" />
          <Field placeholder="Password" type="password" />
          <input type="submit" className="submit" value="Sign In" />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        <form className="sign-up-htm">
          <Field placeholder="Username" />
          <Field placeholder="Password" type="password" />
          <Field placeholder="Repeat password" type="password" />
          <input type="submit" className="submit" value="Sign Up" />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  )
}