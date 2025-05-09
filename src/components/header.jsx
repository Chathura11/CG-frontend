import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MobileNavPanel from './mobileNavPanel';
import { CiLogout, CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import '../App.css'

function Header() {
  const [navPanelOpen, setNavPanelOpen] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          setTokenExpired(true);
          localStorage.removeItem('token'); // optionally remove it now
        }
      } catch (err) {
        console.error('Invalid token', err);
        setTokenExpired(true);
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  return (
    <header className='w-full h-[70px] shadow-md flex justify-center items-center relative bg-accent md:bg-white text-white backdrop-blur-md top-0 z-50'>
      <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 absolute left-1" />

      <FaBars className='absolute right-5 text-[24px] md:hidden' onClick={() => setNavPanelOpen(true)} />

      {tokenExpired && (
        <div className="absolute top-full w-full bg-red-100 text-red-700 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee py-1 text-center font-medium">
            Your session has expired. Please log in.
          </div>
        </div>
      )}

      {token && !tokenExpired ? (
        <>
          <CgProfile className='hidden md:block absolute right-14 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-accent hover:text-white' onClick={() => {
            navigate('/user-profile');
          }} />
          <CiLogout className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-white hover:text-red-500' onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }} />
        </>
      ) : (
        <CiLogin className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-white hover:text-green-500' onClick={() => {
          window.location.href = '/login';
        }} />
      )}

      <MobileNavPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen} />
    </header>
  );
}

export default Header;
