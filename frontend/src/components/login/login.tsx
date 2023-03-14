import './login.scss'

export default function () {
  return (
    <div className="container">
      <div className="login-container">

        <input id="item-1" type="radio" name="item" className="sign-in" checked />
        <label htmlFor="item-1" className="item">Sign In</label>

        <input id="item-2" type="radio" name="item" className="sign-up" />
        <label htmlFor="item-2" className="item">Sign Up</label>

        <div className="login-form">
          <div className="sign-in-htm">
            <input placeholder="Username" id="user" type="text" className="input" />
            <input placeholder="Password" id="pass" type="password" className="input" data-type="password" />
            <input type="submit" className="submit" value="Sign In" />

            <div className="hr"></div>

            <div className="footer">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          <div className="sign-up-htm">
            <input placeholder="Username" id="user" type="text" className="input" />
            <input placeholder="Password" id="pass" type="password" className="input" data-type="password" />
            <input placeholder="Repeat password" id="pass" type="password" className="input" data-type="password" />
            <input type="submit" className="submit" value="Sign Up" />

            <div className="hr"></div>

            <div className="footer">
              <a href="#">Already have an account?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}