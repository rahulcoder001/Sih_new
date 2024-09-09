"use client"; // Ensure this component is treated as a client component

import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



const Page = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post('/api/user/signin', {
        username: emailOrPhone,
        password: password
      });

      if (response.data.msg === "User login") {
        setMessage("Login successful!");
        setError('');
        router.push('/'); 
      } else {
        setError(response.data.msg);
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred during login.');
      setMessage('');
    }
  };

  return (
    <section className="login1">
      <div className="content">
        <div className="text">Login Form</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <span className="fas fa-user"></span>
            <label>Email or Phone</label>
          </div>
          <div className="field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="fas fa-lock"></span>
            <label>Password</label>
          </div>
          <div className="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">Sign in</button>
          <div className="sign-up">
            Not a member?
            <Link href="/signup">Signup now</Link>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
      </div>
    </section>
  );
};

export default Page;
