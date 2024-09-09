"use client"; // Ensure this component is treated as a client component

import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
const router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('/api/user/signup', {
        username: emailOrPhone,
        password: password,

      });

      if (response.data.msg === "User created successfully") {
        setMessage("Signup successful!");
        setError('');
        router.push('/login')
      } else {
        setError(response.data.msg);
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred during signup.');
      setMessage('');
    }
  };

  return (
    <section className="login1">
      <div className="content">
        <div className="text">Signup Form</div>
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
          <div className="field mt-5">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="fas fa-lock"></span>
            <label>Confirm Password</label>
          </div>
          <button type="submit">Sign up</button>
        </form>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
      </div>
    </section>
  );
};

export default Page;
