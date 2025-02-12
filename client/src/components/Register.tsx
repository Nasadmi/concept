import { FC, useRef } from "react";
import { useEffect } from 'react';
import { getCookie, createCookie } from '../service/cookie.service';
import '../styles/Register.css';
import { Link } from 'react-router';
import { fetchingUser } from '../service/fetch.service';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2'

export const Register: FC = () => {
    const visit = useRef(getCookie('first_visit'))

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
      const alert = withReactContent(Swal);
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      fetchingUser({
        url: 'user',
        data,
        method: 'POST'
      })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.statusCode === 409) {
          alert.fire({
            text: 'This user already exists',
            icon: 'warning',
            position: 'bottom-left',
            timer: 2000
          })
          return;
        }
        
        if (res.statusCode === 400) {
          alert.fire({
            text: 'Email not valid or not strong password',
            icon: 'warning',
            position: 'bottom-left',
            timer: 2000
          })
          return;
        }

        alert.fire({
          text: 'User created',
          icon: 'success',
          position: 'bottom-left',
          timer: 2000
        }).then(() => {
          window.location.href = "http://localhost:5173/login";
        })
      })
      .catch((e) => {
        alert.fire({
          text: 'Something went wrong',
          icon: 'error',
          position: 'bottom-left',
          timer: 2000
        })
        console.error(e);
      })
    }

    useEffect(() => {
      if (!visit.current) {
        createCookie({ name: 'first_visit', value: '1' })
      }
    }, [])

    return (
        <div className='register-main'>
          <div className="register-main-banner">
            <h1 className='maven_pro register-banner-title'>Sign In</h1>
          </div>
          <div className='flex-center'>
          <form className='register-main-form maven_pro' onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <input type="submit" value="Sign In" className='ubuntu' />
          </form>
          <Link to="/login" className='link-form-type ubuntu'>Do you have an account? Log In</Link>
          </div>
        </div>
    );
}
