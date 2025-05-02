import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/login/login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import VerifyEmail from './pages/verifyEmail/verifyEmail'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/register/register';
import ChangePasswordPage from './pages/forgotPassword/changePasswordPage'
import ForgotPasswordPage from './pages/forgotPassword/forgotPasswordPage'
import HomePage from './pages/home/homePage'

function App() {

  return (
    <GoogleOAuthProvider clientId='767408687073-pk28tikluhnp3hfplc83a6far7qb3kd2.apps.googleusercontent.com'>
      <BrowserRouter>
        <Toaster/>
        <Routes path="/*">
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/verify-email' element={<VerifyEmail/>}></Route>
          <Route path='/Register' element={<RegisterPage/>}></Route>
          <Route path='/forgot-password' element={<ForgotPasswordPage/>}></Route>
          <Route path='/change-password' element={<ChangePasswordPage/>}></Route>
          <Route path='/*' element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
