import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown = () => {
  const { user, logout } = useAppContext()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfile = () => {
    navigate('/profile')
    setOpen(false)
  }

  const handleChangePassword = () => {
    navigate('/change-password')
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        onClick={() => setOpen(prev => !prev)}
        className='flex items-center gap-2 rounded-full border border-borderColor bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-lg'
      >
        <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#7FFF00] text-black'>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
        <span className='hidden sm:inline'>{user?.name || 'Profile'}</span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className='absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-borderColor bg-white p-4 shadow-2xl'
        >
          <div className='space-y-3'>
            <div className='rounded-2xl bg-slate-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#7FFF00] text-black text-lg font-bold'>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className='font-semibold text-slate-900'>{user?.name || 'No name'}</p>
                  <p className='text-sm text-slate-500'>{user?.email || 'No email'}</p>
                </div>
              </div>
              <p className='mt-3 rounded-full bg-white px-3 py-1 text-xs uppercase tracking-wide text-[#006400] shadow-sm'>
                {user?.role || 'user'}
              </p>
            </div>

            {user?.role !== 'owner' && user?.role !== 'admin' && (
              <button
                onClick={handleProfile}
                className='w-full rounded-xl border border-borderColor bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#f7fff0] transition'
              >
                View Profile
              </button>
            )}
            <button
              onClick={handleChangePassword}
              className='w-full rounded-xl bg-[#7FFF00] px-4 py-2 text-sm font-semibold text-black hover:bg-[#6fdc00] transition'
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className='w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition'
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProfileDropdown
