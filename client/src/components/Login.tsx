import { FC } from "react";
import '../styles/Login.css'

export const Login: FC = () => {
  return (
    <div className='login-main'>
      <div className="login-main-banner">
        <h1 className='maven_pro login-banner-title'>Log In</h1>
      </div>
      <form className='login-main-form maven_pro'>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" autoComplete='off' spellCheck='false'className='ubuntu'/>
        <label htmlFor="password">Password</label>
        <input type="password" name="pasword" id="password" autoComplete='off' spellCheck='false'className='ubuntu'/>
        <input type="button" value="Log In" className='ubuntu' />
      </form>
    </div>
);
}
