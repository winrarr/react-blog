import { ChangeEvent, useReducer, useState } from "react"

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

  interface stateType {
    siu: string,
    sip: string,
    suu: string,
    sup1: string,
    sup2: string,
  }

  const reducer = (state: stateType, action: { variable: string, value: string }) => ({
    ...state,
    [action.variable]: action.value,
  })

  const initialState: stateType = {
    siu: "",
    sip: "",
    suu: "",
    sup1: "",
    sup2: "",
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const signInValid = state.siu.length > 0 && state.sip.length > 0
  const signUpValid = state.suu.length > 0 && state.sup1.length > 0 && state.sup1 == state.sup2

  const fieldChanged = (variable: string) => (e: ChangeEvent<HTMLInputElement>) =>
    dispatch({
      variable,
      value: e.target.value,
    })

  const handleSignUp = (e) => 

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
        <form className="sign-in-htm" onSubmit={handleSignIn}>
          <Field placeholder="Username" name="password" onChange={fieldChanged("siu")} />
          <Field placeholder="Password" type="password" name="password" onChange={fieldChanged("sip")} />
          <input type="submit" value="Sign In" className={`submit ${signInValid ? "" : "invalid"}`} />

          <div className="hr"></div>

          <div className="footer">
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        {/* sign up */}
        <form className="sign-up-htm" onSubmit={handleSignUp}>
          <Field placeholder="Username" name="username" onChange={fieldChanged("suu")} />
          <Field placeholder="Password" type="password" name="password" onChange={fieldChanged("sup1")} />
          <Field placeholder="Repeat password" type="password" onChange={fieldChanged("sup2")} />
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