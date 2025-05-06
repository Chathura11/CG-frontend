import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import Spinner from "../../components/spinner";

export default function UserEdit() {
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        address: "",
        phone: "",
        profilePicture: "",
        password: "",
        newPassword: ""
    });

    const [loading,setLoading] = useState(false);

    const [newImage,setNewImage] = useState(null);

    useEffect(() => {
        LoadUser();
    }, []);

    async function LoadUser() {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prev => ({
                ...prev,
                ...result.data
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setLoading(true);

        let newImageUrl;
        if(newImage){
            newImageUrl = await mediaUpload(newImage[0]);
        }else{
            newImageUrl = user.profilePicture;
        }

        const newData = {
            password:user.password,
            newPassword:user.newPassword,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            phone: user.phone,
            profilePicture: newImageUrl
        };

        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/edit/${user.email}`, newData, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res)=>{
            console.log(res.data);
            toast.success("User updated successfully!");
            LoadUser();
        }).catch((error)=>{
            console.log(error.response.data.message);
            toast.error("Update failed!");
        }).finally(()=>{
            setLoading(false);
        })
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-accent">Edit Profile</h1>
            <form onSubmit={handleUpdate} className="space-y-3">
                <input name="firstname" value={user.firstname} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" />
                <input name="lastname" value={user.lastname} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" />
                <input name="address" value={user.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
                <input name="phone" value={user.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
                <input type="file" name="profilePicture" onChange={(e)=>setNewImage(e.target.files)} placeholder="Profile Picture URL" className="w-full p-2 border rounded" />
                <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Current Password" className="w-full p-2 border rounded" />
                <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} placeholder="New Password" className="w-full p-2 border rounded" />
                <button 
                    type="submit" 
                    className="bg-accent hover:bg-accent-second cursor-pointer text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                >
                        {
                            loading
                            ?
                            <Spinner /> 
                            :
                            "Update"
                        }
                </button>
            </form>
        </div>
    );
}
