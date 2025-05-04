import { Route, Routes } from 'react-router-dom'
import Header from '../../components/header'
import UserProfile from '../profile/userProfile'
import Error from './error'
import UserEdit from '../profile/userEdit'
import Dashboard from './dashboard'
import SideBar from '../../components/sidebar'
import ExpensesPage from './expensesPage'
import SchedulesPage from './schedulesPage'
import AddExpensePage from './addExpensePage'
import AddSchedulePage from './addSchedulePage'
import HistoryExpensesPage from './historyExpensesPage'

export default function HomePage(){
    return(
        <>
            <Header/>
            <div className="w-full h-[calc(100vh-70px)] flex bg-gray-50 overflow-hidden">
                <SideBar/>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Routes path="/*">
                        <Route path='/user-profile' element={<UserProfile/>}></Route>
                        <Route path='/user-edit' element={<UserEdit/>}></Route>
                        <Route path='/expenses' element={<ExpensesPage/>}/>
                        <Route path='/history' element={<HistoryExpensesPage/>}/>
                        <Route path='/add-expense' element={<AddExpensePage/>}/>
                        <Route path='/edit-expense' element={<AddExpensePage edit={true}/>}/>
                        <Route path='/schedules' element={<SchedulesPage/>}/>
                        <Route path='/add-schedule' element={<AddSchedulePage/>}/>
                        <Route path='/edit-schedule' element={<AddSchedulePage edit={true}/>}/>
                        <Route path='/' element={<Dashboard/>}/>
                        <Route path='/*' element={<Error/>}/>
                    </Routes>
                </main>   
            </div>
        </>
    )
}