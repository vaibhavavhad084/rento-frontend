import React, { useEffect } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import ProfileDropdown from '../components/ProfileDropdown'

const AdminLayout = () => {
  const { user, token } = useAppContext()

  useEffect(() => {
    if (token && user && user.role !== 'admin') {
      // force redirect if logged in but not admin
      window.location.href = '/admin/login'
    }
  }, [token, user])

  // If user is logged out (no token and no user), allow redirect to home
  if (!token && !user) {
    return null
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  if (token && user && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  if (token && !user) {
    return null
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='border-b border-borderColor bg-white px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Admin Panel</h1>
          <p className='text-sm text-gray-500 mt-1'>Manage users, cars, bookings, and platform approvals.</p>
        </div>
        <ProfileDropdown />
      </div>

      <div className='flex flex-col lg:flex-row'>
        <aside className='w-full lg:w-72 border-r border-borderColor bg-white p-6 space-y-3'>
          <NavLink to='/admin/dashboard' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            Dashboard
          </NavLink>
          <NavLink to='/admin/users' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            Users
          </NavLink>
          <NavLink to='/admin/kyc-requests' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            KYC Requests
          </NavLink>
          <NavLink to='/admin/cars' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            Cars
          </NavLink>
          <NavLink to='/admin/pending-cars' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            Pending Cars
          </NavLink>
          <NavLink to='/admin/bookings' className={({isActive}) => `${isActive ? 'bg-[#7FFF00]/10 border-[#7FFF00] text-black' : 'hover:bg-gray-50'} block rounded-md border border-borderColor px-4 py-3 transition`}>
            Bookings
          </NavLink>
        </aside>

        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
