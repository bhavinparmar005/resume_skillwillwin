import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword '
import VerifyOtp from './pages/VerifyOtp '
import ResetPassword from './pages/ResetPassword '
import SchoolDetails from './pages/SchoolDetails'
import AddSchoolForm from './pages/AddSchoolForm'
import EditSchoolForm from './pages/EditSchoolForm'
import AddBlogForm from './pages/AddBlogForm'
import EditBlogForm from './pages/EditBlogForm'
import Test from './pages/Test'
import NotFound from './pages/NotFound'
import PincodeForm from './pages/PincodeForm'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path='/' element={<AdminLogin />} />
          <Route path='/home' element={<Home />} />  
          <Route path='/addblog' element={<AddBlogForm />} /> 
          <Route path='/editblog' element={<EditBlogForm />} />
          <Route path='/schooldetails' element={<SchoolDetails />} />
          <Route path='/addschool' element={<AddSchoolForm />} />
          <Route path='/editschool' element={<EditSchoolForm />} />
          <Route path='/forgetpassword' element={<ForgotPassword />} />
          <Route path='/verifyotp' element={<VerifyOtp />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/t' element={<Test />} />
          <Route path='/pin' element={<PincodeForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App