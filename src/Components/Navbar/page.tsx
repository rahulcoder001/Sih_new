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
          setIsAuthenticated(response.data.ok);
       
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
    <section className='px-20 p-5'>
      <ul className='flex flex-row  list-none  justify-between'>
        <div className='flex'>
          <h2 style={{ fontFamily: 'Irish Grover, cursive', fontSize: '2rem' }}>
            <Link href="/">DocuVer</Link>
          </h2>
        </div>
        <div className='flex gap-10 text-sm items-center text-gray-500'>
          <li className='font-bold text-black'>Home</li>
          <li>How it work</li>
          <li>Download</li>
          {isSuperUser ? (
            <li><Link href="/upload">UploadFile</Link></li>
          ) : (
            <li><Link href="/verify">VerifyFile</Link></li>
          )}
        </div>

        <div className='login flex items-center font-bold underline'>
          {isAuthenticated ? (
            <button onClick={handleLogout} className='bg-white p-2 px-3 text-xs rounded-2xl mr-3 shadow-xl shadow-slate-200'>LOG OUT</button>
          ) : (
            <div>
              <button onClick={()=>{router.push("/login")}} className='bg-white p-2 px-3 text-xs rounded-2xl mr-3 shadow-xl shadow-slate-200'>LOG IN</button>
              <button onClick={()=>{router.push("/signup")}} className='bg-red-400 p-2 px-3 text-xs rounded-2xl text-white '>SIGN UP</button>
            </div>
          )}
        </div>
      </ul>
    </section>
  );
};

export default Navbar;
