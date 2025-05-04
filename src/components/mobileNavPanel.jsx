import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCashCoin,BsTable,BsGraphDown  } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { TbLogin2 } from "react-icons/tb";
import { MdOutlineWorkHistory } from "react-icons/md";

export default function MobileNavPanel(props) {
    const isOpen = props.isOpen;
    const setOpen = props.setOpen;

    const [visible, setVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    function Goto(route) {
        navigate(route);
        setOpen(false);
    }

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setTimeout(() => setAnimate(true), 10);  // Start slide-in
        } else {
            setAnimate(false);  // Start slide-out
            setTimeout(() => setVisible(false), 300);  // Wait for animation to finish
        }
    }, [isOpen]);

    return (
        <>
            {visible && (
                <div className={`fixed top-0 left-0 w-full h-screen z-50 flex 
                    ${animate ? 'bg-[#00000075]' : 'bg-transparent'} 
                    transition-colors duration-300 ease-in-out`}>
                    <div
                        className={`h-full bg-white w-[300px] transform 
                        ${animate ? 'translate-x-0' : '-translate-x-full'}
                        transition-transform duration-300 ease-in-out shadow-lg`}
                    >
                        <div className="bg-accent w-full h-[70px] flex justify-center items-center relative">
                            <img src="/logo.png" alt='logo' className='w-[60px] h-[60px] object-cover border-[1px] absolute left-1 rounded-full ' />
                            <IoMdClose
                                className="absolute right-3 text-3xl cursor-pointer hover:text-red-500 transition-colors"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        <div className="p-3 space-y-2">
                            <div onClick={() => Goto('/')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <BsGraphDown className="text-2xl" /> Dashboard
                            </div>
                            <div onClick={() => Goto('/schedules')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <BsTable className="text-2xl" /> Schedules
                            </div>
                            <div onClick={() => Goto('/expenses')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <BsCashCoin className="text-2xl" /> Expenses
                            </div>
                            <div onClick={() => Goto('/history')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <MdOutlineWorkHistory className="text-2xl" /> History
                            </div>
                            {
                                token &&
                                <div onClick={() => Goto('/user-profile')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <FaRegUser  className="text-2xl" /> Profile
                                </div>

                            }
                            {token !=null ?
                                <div onClick={() => {
                                    localStorage.removeItem('token')
                                    Goto('/login')
                                }} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <TbLogout2 className="text-2xl" /> Log Out
                                </div>
                                :
                                <div onClick={() => Goto('/login')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <TbLogin2 className="text-2xl" /> Log In
                                </div>
                            }
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
