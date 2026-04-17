import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ label = 'Back', fallback = '/' }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      type='button'
      onClick={handleBack}
      className='inline-flex items-center gap-2 rounded-full border border-borderColor bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white hover:border-black'
    >
      <span className='text-lg'>←</span>
      {label}
    </button>
  )
}

export default BackButton
