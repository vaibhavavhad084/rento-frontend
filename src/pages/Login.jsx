import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {
  const { axios, navigate, setToken, setUser, user } = useAppContext()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    } else if (user?.role === 'owner') {
      navigate('/owner/dashboard')
    } else if (user?.role === 'user') {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login', { email, password, role })
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        setUser(data.user)

        if (data.user.role === 'owner') {
          navigate('/owner/dashboard')
        } else if (data.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('/api/user/register', { name, email, mobile, password })
      if (data.success) {
        toast.success('Account created. Please login now.')
        setMode('login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md rounded-3xl border border-borderColor bg-white p-8 shadow-xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-semibold'>Welcome back</h1>
          <p className='text-sm text-gray-500 mt-2'>Login with your account or create a new one.</p>
        </div>

        <div className='mb-8 flex items-center justify-between gap-3'>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${mode === 'login' ? 'bg-[#7FFF00] text-black' : 'bg-slate-100 text-slate-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${mode === 'register' ? 'bg-[#7FFF00] text-black' : 'bg-slate-100 text-slate-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className='space-y-4'>
          {mode === 'login' && (
            <div className='rounded-2xl border border-borderColor bg-slate-50 p-3'>
              <p className='mb-3 text-sm font-medium text-slate-600'>Select role</p>
              <div className='grid grid-cols-3 gap-2'>
                {['user', 'owner', 'admin'].map((option) => (
                  <button
                    key={option}
                    type='button'
                    onClick={() => setRole(option)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${role === option ? 'border-[#7FFF00] bg-[#F7FFE6] text-slate-900' : 'border-borderColor bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className='text-sm font-medium text-slate-700'>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-2 w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
                type='text'
                placeholder='Your name'
                required
              />
            </div>
          )}

          <div>
            <label className='text-sm font-medium text-slate-700'>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-2 w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
              type='email'
              placeholder='you@example.com'
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className='text-sm font-medium text-slate-700'>Mobile Number</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className='mt-2 w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
                type='tel'
                placeholder='1234567890'
                pattern='[0-9]{10}'
                required
              />
            </div>
          )}

          <div>
            <label className='text-sm font-medium text-slate-700'>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-2 w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
              type='password'
              placeholder='Enter password'
              required
            />
          </div>

          {mode === 'login' && (
            <div className='flex items-center justify-between text-sm text-[#7FFF00]'>
              <p className='cursor-pointer hover:underline' onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </p>
            </div>
          )}

          <button type='submit' className='w-full rounded-2xl bg-[#7FFF00] py-3 text-sm font-semibold text-black transition hover:bg-[#6fdc00]'>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
