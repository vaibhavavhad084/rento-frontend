import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user } = useAppContext()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-16'>
      <div className='mx-auto max-w-3xl rounded-3xl border border-borderColor bg-white p-8 shadow-xl'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold'>Your Profile</h1>
            <p className='text-sm text-gray-500 mt-2'>View your account details and update your password securely.</p>
          </div>
          <button
            onClick={() => navigate('/change-password')}
            className='rounded-2xl bg-[#7FFF00] px-4 py-3 text-sm font-semibold text-black hover:bg-[#6fdc00] transition'
          >
            Change Password
          </button>
        </div>

        <div className='mt-8 grid gap-6 md:grid-cols-2'>
          <div className='rounded-3xl border border-borderColor bg-slate-50 p-6'>
            <p className='text-sm text-gray-500'>Full name</p>
            <p className='mt-2 text-lg font-semibold text-slate-900'>{user.name}</p>
          </div>
          <div className='rounded-3xl border border-borderColor bg-slate-50 p-6'>
            <p className='text-sm text-gray-500'>Email address</p>
            <p className='mt-2 text-lg font-semibold text-slate-900'>{user.email}</p>
          </div>
          <div className='rounded-3xl border border-borderColor bg-slate-50 p-6'>
            <p className='text-sm text-gray-500'>Role</p>
            <p className='mt-2 text-lg font-semibold text-slate-900'>{user.role}</p>
          </div>
          <div className='rounded-3xl border border-borderColor bg-slate-50 p-6'>
            <p className='text-sm text-gray-500'>Member since</p>
            <p className='mt-2 text-lg font-semibold text-slate-900'>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
