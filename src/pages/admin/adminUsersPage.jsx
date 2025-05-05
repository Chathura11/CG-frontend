import { useEffect, useState } from "react";
import axios from 'axios';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");

            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res.data);
                setUsers(res.data);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            });
        }
    }, [loading]);

    function handleBlockUser(email){
        const token = localStorage.getItem('token');

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/block/${email}`,{},{headers:{
            Authorization:`Bearer ${token}`
        }}).then((res)=>{
            console.log(res.data);
            setLoading(true);
        }).catch((error)=>{
            console.log(error);
        })
    }

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">Admin Users Page</h1>
            {loading ? (
                <div className="flex justify-center items-center mt-20">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto w-full shadow-md rounded-lg bg-white">
                    <table className="min-w-full text-gray-700">
                        <thead className="bg-gray-200 uppercase text-xs font-semibold">
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 ">Profile</th>
                                <th className="py-3 px-4 ">First Name</th>
                                <th className="py-3 px-4 ">Last Name</th>
                                <th className="py-3 px-4 ">Email</th>
                                <th className="py-3 px-4 ">Role</th>
                                <th className="py-3 px-4 ">Phone</th>
                                <th className="py-3 px-4 ">Address</th>
                                <th className="py-3 px-4 ">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        <img
                                            src={user.profilePicture}
                                            alt={`${user.firstname} ${user.lastname}`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="py-2 px-4 ">{user.firstname}</td>
                                    <td className="py-2 px-4">{user.lastname}</td>
                                    <td className="py-2 px-4 ">{user.email}</td>
                                    <td className="py-2 px-4 capitalize">{user.role}</td>
                                    <td className="py-2 px-4 ">{user.phone}</td>
                                    <td className="py-2 px-4 ">{user.address}</td>
                                    <td onClick={()=>handleBlockUser(user.email)} className="py-2 px-4 cursor-pointer">{user.isBlocked?"BLOCKED":"ACTIVE"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
