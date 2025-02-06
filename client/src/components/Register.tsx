import { FC, useRef } from "react";
import { useEffect } from 'react';
import { getCookie, createCookie } from '../service/cookie.service';
import '../styles/Register.css';

export const Register: FC = () => {
    const visit = useRef(getCookie('first_visit'))

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
          <form className='register-main-form maven_pro'>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <label htmlFor="password">Password</label>
            <input type="password" name="pasword" id="password" autoComplete='off' spellCheck='false'className='ubuntu'/>
            <input type="button" value="Sign In" className='ubuntu' />
          </form>
        </div>
    );
}
