"use client";

import React, { useEffect, useState } from 'react';
import './navbar.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verify token by calling an API or checking stored user data
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/verify-token");
        
          setIsSuperUser(response.data.superuser);
          setIsAuthenticated(true);
       
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  });

  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
      setIsAuthenticated(false); // Update state to reflect logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <section className='flex items-center justify-between p-4'>
      <ul className='flex flex-row space-x-4 list-none p-0 m-0'>
        <div>
          <h2 style={{ fontFamily: 'Irish Grover, cursive', fontSize: '2rem' }}>
            <Link href="/">DocuVer</Link>
          </h2>
        </div>
        <div className='navbar'>
          <li>What is DocuVer</li>
          <li>Platform</li>
          <li>Solutions</li>
          {isSuperUser ? (
            <li><Link href="/upload">Upload</Link></li>
          ) : (
            <li><Link href="/verify">Verify</Link></li>
          )}
          <li>About</li>
          <li>Contact</li>
        </div>

        <div className='login'>
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </div>
      </ul>
    </section>
  );
};

export default Navbar;
