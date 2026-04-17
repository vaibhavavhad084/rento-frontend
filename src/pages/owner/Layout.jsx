import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {user, navigate} = useAppContext()

  useEffect(()=>{
    if(!user) {
      navigate('/login')
    } else if(user.role !== 'owner') {
      navigate('/login')
    } else if(!user.isKycApproved) {
      navigate('/owner-kyc')
    }
  },[user, navigate])
  
  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
