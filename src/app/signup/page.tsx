"use client"; // Ensure this component is treated as a client component

import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function GoogleIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
}

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
    <section className="flex justify-center mt-20">
      <div className='w-1/3'>
        <p className='font-bold text-2xl'>Register</p>
        <p className='text-xs mt-1 text-gray-600'>Welcome! Please enter your details to create an account</p>

        {/* Dropdown with Verifying Authority and Issuing Authority */}
        <select className=" p-2  rounded-lg bg-white my-1 w-full outline-red-400 mt-10">
          <option className='bg-white' value="verifying" selected>Verifying Authority</option>
          <option value="issuing">Issuing Authority</option>
        </select>

        <div className='flex flex-col text-sm font-semibold mt-5'>
          <label htmlFor="email" className='text-slate-600'>Authority name</label>
          <input type="text" id='email' placeholder='Enter Authority name' className='bg-transparent border-black my-1 p-2 border-2 rounded-lg outline-red-400' />
        </div>
        
        <p className='mt-5 text-sm font-semibold text-slate-600'>Authority type</p>
        <select className=" p-2  rounded-lg bg-white my-1 w-full outline-red-400 font-bold border-2 border-black">
          <option className='' value="verifying" selected>Goverment</option>
          <option value="issuing">Public</option>
        </select>

        <div className='flex flex-col text-sm font-semibold mt-5'>
          <label htmlFor="email" className='text-slate-600'>Email</label>
          <input type="text" id='email' placeholder='Enter Your email' className='bg-transparent border-black my-1 p-2 border-2 rounded-lg outline-red-400' />
        </div>

        <div className='flex flex-col text-sm font-semibold mt-5'>
          <label htmlFor="password" className='text-slate-600'>Password</label>
          <input type="password" id='password' placeholder='Create Password' className='bg-transparent my-1 p-2 border-black border-2 rounded-lg outline-red-400' />
        </div>

        <div className='flex flex-col text-sm font-semibold mt-5'>
          <label htmlFor="password" className='text-slate-600'>Confirm Password</label>
          <input type="password" id='password' placeholder='Create Password' className='bg-transparent my-1 p-2 border-black border-2 rounded-lg outline-red-400' />
        </div>

        <div className='flex px-2 text-sm mt-3'>
          <div className='flex items-center font-semibold'>
            <input type="checkbox" className='mr-2' />
            <p>accpet term and condition and</p>
          </div>
          <p className='text-red-400 ml-1'>Term and condition</p>
        </div>
        <button className='w-full p-2 text-sm rounded-lg text-white bg-red-400 mt-4'>Register Now</button>
        <button className='w-full border-2 p-1 text-sm rounded-lg mt-4 flex items-center gap-2 justify-center border-black text-black'><GoogleIcon/> Sign up with Google</button>
        <p className='flex justify-center text-xs p-5'>Already have an account? <span className='text-red-400 ml-2 font-bold underline'><Link href={"/login"}>sign in</Link></span></p>
      </div>
    </section>
  );
};

export default Page;
