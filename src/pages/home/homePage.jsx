import { Route, Routes } from 'react-router-dom'
import Header from '../../components/header'
import UserProfile from '../profile/userProfile'
import Error from './error'
import UserEdit from '../profile/userEdit'
import Dashboard from './dashboard'
import SideBar from '../../components/sidebar'

export default function HomePage(){
    return(
        <>
            <Header/>
            <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
                <SideBar/>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Routes path="/*">
                        <Route path='/user-profile' element={<UserProfile/>}></Route>
                        <Route path='/user-edit' element={<UserEdit/>}></Route>
                        <Route path='/' element={<Dashboard/>}/>
                        <Route path='/*' element={<Error/>}/>
                    </Routes>
                </main>   
            </div>
        </>
    )
}