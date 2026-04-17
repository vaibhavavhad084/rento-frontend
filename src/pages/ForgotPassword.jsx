import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const { axios } = useAppContext()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email })
      if (data.success) {
        toast.success(data.message)
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
        <h1 className='text-3xl font-semibold mb-3'>Forgot Password</h1>
        <p className='text-sm text-gray-500 mb-8'>Enter the email associated with your account and we’ll send a reset link.</p>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>Email Address</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full rounded-2xl border border-borderColor bg-slate-50 p-3 outline-none focus:border-[#7FFF00]'
              placeholder='you@example.com'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-2xl bg-[#7FFF00] py-3 text-sm font-semibold text-black transition hover:bg-[#6fdc00] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
