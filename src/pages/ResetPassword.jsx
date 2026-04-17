import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { axios } = useAppContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const queryToken = searchParams.get('token') || ''
    const queryEmail = searchParams.get('email') || ''
    setToken(queryToken)
    setEmail(queryEmail)
  }, [searchParams])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token || !email) {
      toast.error('Reset link is invalid or expired.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/reset-password', {
        email,
        token,
        newPassword,
        confirmPassword
      })
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16'>
      <div className='w-full max-w-md rounded-3xl border border-borderColor bg-white p-8 shadow-xl'>
        <h1 className='text-3xl font-semibold mb-3'>Reset Password</h1>
        <p className='text-sm text-gray-500 mb-8'>Create a new password for your account.</p>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>New Password</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
              required
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>Confirm New Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-2xl bg-[#7FFF00] py-3 text-sm font-semibold text-black transition hover:bg-[#6fdc00] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
