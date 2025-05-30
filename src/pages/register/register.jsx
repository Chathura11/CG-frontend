import { useState } from "react";
import "./register.css";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    function handleOnChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        axios.post(backendUrl + '/api/users', formData)
            .then((res) => {
                toast.success('Registration successful');
                navigate('/login');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Registration failed');
            });
    }

    return (
        <div className="bg-picture w-full h-screen flex justify-center items-center relative">
            <form onSubmit={handleOnSubmit} className="relative z-10">
                <div className="w-[600px] h-auto p-8 bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col justify-center items-center space-y-6">

                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-24 h-24 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                    />

                    <input 
                        name="firstname" 
                        onChange={handleOnChange} 
                        value={formData.firstname} 
                        type="text" 
                        placeholder="First Name" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="lastname" 
                        onChange={handleOnChange} 
                        value={formData.lastname} 
                        type="text" 
                        placeholder="Last Name" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="email" 
                        onChange={handleOnChange} 
                        value={formData.email} 
                        type="email" 
                        placeholder="Email" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="password" 
                        onChange={handleOnChange} 
                        value={formData.password} 
                        type="password" 
                        placeholder="Password" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="address" 
                        onChange={handleOnChange} 
                        value={formData.address} 
                        type="text" 
                        placeholder="Address" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="phone" 
                        onChange={handleOnChange} 
                        value={formData.phone} 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <button 
                        type="submit"
                        className="w-[300px] py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-lg rounded-xl shadow-md hover:from-amber-600 hover:to-yellow-500 transition-all cursor-pointer"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
