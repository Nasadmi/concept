import { FC } from "react";
import '../styles/Login.css'
import { Link } from 'react-router';
import { fetchingUser } from '../service/fetch.service';
import { toast } from '../service/alert.service';
import { createCookie } from '../service/cookie.service';

export const Login: FC = () => {
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    fetchingUser({
      url: 'user/login',
      data,
      method: 'POST'
    })
    .then((response) => response.json())
    .then((bearer) => {
      if (bearer.statusCode === 404 || bearer.statusCode === 401) {
        toast.fire({
          text: 'Password or user is incorrect',
          icon: 'warning',
          position: 'bottom-left'
        })
        return;
      }

      toast.fire({
        text: 'Welcome',
        icon: 'success',
        position: 'bottom-left',
        timer: 2000
      }).then(() => {
        createCookie({ name: 'bearer', value: bearer.message, days: 1 })
        window.location.href = "http://localhost:5173/";
      })
    })
    .catch((e) => {
      toast.fire({
        text: 'Something went wrong',
        icon: 'error',
        position: 'bottom-left'
      })
      console.error(e);
    })
  } 

  return (
    <div className='login-main'>
      <div className="login-main-banner">
        <h1 className='maven_pro login-banner-title'>Log In</h1>
      </div>
      <div className='flex-center'>
      <form className='login-main-form maven_pro' onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" autoComplete='off' spellCheck='false'className='ubuntu'/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" autoComplete='off' spellCheck='false'className='ubuntu'/>
        <input type="submit" value="Log In" className='ubuntu' />
      </form>
      <Link to="/signin" className='link-form-type maven_pro'>Don't you have an account? Sign In</Link>
      </div>
    </div>
);
}
