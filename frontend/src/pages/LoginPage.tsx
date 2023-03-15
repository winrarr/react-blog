interface LoginSignupProps {
  fields: string[],
}

export default function () {
  interface FieldProps {
    placeholder: string,
    id: string,
    type?: string,
  }

  const Field = ({ placeholder, id, type = "text" }: FieldProps) => (
    <>
      <input id={id} type={type} className="input" />
      <label>{placeholder}</label>
    </>
  )

  return (
    <div className="login-container">

      <input id="item-1" type="radio" name="item" className="sign-in" checked />
      <label htmlFor="item-1" className="item">Sign In</label>

      <input id="item-2" type="radio" name="item" className="sign-up" />
      <label htmlFor="item-2" className="item">Sign Up</label>

      <div className="active"></div>

      <div className="login-form">
        <form className="sign-in-htm">
          <Field placeholder="Username" id="user" />
          <Field placeholder="Password" id="pass" type="password" />
          <input type="submit" className="submit" value="Sign In" />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        <form className="sign-up-htm">
          <Field placeholder="Username" id="user" />
          <Field placeholder="Password" id="pass" type="password" />
          <Field placeholder="Repeat password" id="pass" type="password" />
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