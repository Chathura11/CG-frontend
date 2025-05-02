import React, { useState } from 'react'
import { FaBars, FaCartPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import MobileNavPanel from './mobileNavPanel';
import { CiLogout,CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function header() {

  const [navPanelOpen,setNavPanelOpen] = useState(false);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();


  return (
    <header className='w-full h-[70px] shadow-md  flex justify-center items-center relative bg-accent md:bg-white text-white backdrop-blur-md top-0 z-50'>
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 absolute left-1"/>

        <FaBars className='absolute right-5 text-[24px] md:hidden' onClick={()=>setNavPanelOpen(true)}/>
        {token != null ?
          <CiLogout className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-white hover:text-red-500' onClick={()=>{
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}/>
          :
          <CiLogin className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-white hover:text-green-500' onClick={()=>{
            window.location.href = '/login'
          }}/>
        }
        {
          token &&
          <CgProfile className='hidden md:block absolute right-15 text-[30px] cursor-pointer rounded-full p-1 text-accent hover:bg-accent hover:text-white' onClick={()=>{
            navigate('/user-profile');
          }}/>
        }
        <MobileNavPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen}/>
    </header>
  )
}

export default header