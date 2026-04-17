import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const { axios, setToken, setUser, user } = useAppContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login', { email, password, role: 'admin' })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
        navigate('/admin/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='min-h-screen bg-black/50 flex items-center justify-center px-4 py-10'>
      <form onSubmit={handleSubmit} className='w-full max-w-md p-8 bg-white rounded-xl border border-borderColor shadow-lg'>
        <h1 className='text-3xl font-semibold mb-3'>Admin Login</h1>
        <p className='text-sm text-gray-500 mb-6'>Sign in with your admin credentials to access the dashboard.</p>

        <label className='block mb-4'>
          <span className='text-sm text-gray-600'>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required placeholder='admin@example.com' className='mt-2 w-full border border-gray-200 rounded-md p-3 outline-none focus:border-[#7FFF00]' />
        </label>

        <label className='block mb-6'>
          <span className='text-sm text-gray-600'>Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' required placeholder='********' className='mt-2 w-full border border-gray-200 rounded-md p-3 outline-none focus:border-[#7FFF00]' />
        </label>

        <button type='submit' className='w-full rounded-lg bg-[#7FFF00] py-3 text-black font-medium hover:bg-[#6fdc00] transition'>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
