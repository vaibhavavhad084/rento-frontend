import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Payment from './pages/Payment'
import HelpCenter from './pages/HelpCenter'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Insurance from './pages/Insurance'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import OwnerKYC from './pages/OwnerKYC'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/Dashboard'
import AdminUsers from './admin/Users'
import AdminCars from './admin/Cars'
import PendingCars from './admin/PendingCars'
import AdminBookings from './admin/Bookings'
import KYCRequests from './admin/KYCRequests'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

  const { user } = useAppContext()
  const navigate = useNavigate()
  const path = useLocation().pathname
  const isOwnerPath = path.startsWith('/owner')
  const isAdminPath = path.startsWith('/admin')

  useEffect(() => {
    if (user?.role === 'owner' && path === '/') {
      navigate('/owner/dashboard')
    }
    if (user?.role === 'admin' && path === '/') {
      navigate('/admin/dashboard')
    }
  }, [user, path, navigate])

  return (
    <>
     <Toaster />
      {!isOwnerPath && !isAdminPath && <Navbar/>}

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/car-details/:id' element={<CarDetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/payment' element={<ProtectedRoute allowedRoles={['user']}><Payment/></ProtectedRoute>} />
      <Route path='/my-bookings' element={<ProtectedRoute allowedRoles={['user']}><MyBookings/></ProtectedRoute>} />
      <Route path='/about' element={<About/>}/>
      <Route path='/insurance' element={<Insurance/>}/>
      <Route path='/terms' element={<Terms/>}/>
      <Route path='/cookies' element={<Cookies/>}/>
      <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
      <Route path='/help-center' element={<HelpCenter/>}/>
      <Route path='/owner-kyc' element={<OwnerKYC/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<ProtectedRoute allowedRoles={['user','owner','admin']}><Profile/></ProtectedRoute>}/>
      <Route path='/change-password' element={<ProtectedRoute allowedRoles={['user','owner','admin']}><ChangePassword/></ProtectedRoute>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />}/>
        <Route path='dashboard' element={<AdminDashboard />}/>
        <Route path='users' element={<AdminUsers />}/>
        <Route path='kyc-requests' element={<KYCRequests />}/>
        <Route path='cars' element={<AdminCars />}/>
        <Route path='pending-cars' element={<PendingCars />}/>
        <Route path='bookings' element={<AdminBookings />}/>
      </Route>
      <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path='dashboard' element={<Dashboard />}/>
        <Route path='add-car' element={<AddCar />}/>
        <Route path='manage-cars' element={<ManageCars />}/>
        <Route path='manage-bookings' element={<ManageBookings />}/>
      </Route>
    </Routes>

    {!isOwnerPath && !isAdminPath && <Footer />}
    
    </>
  )
}

export default App
