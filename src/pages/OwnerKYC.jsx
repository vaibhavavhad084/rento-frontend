import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import BackButton from '../components/BackButton'

const OwnerKYC = () => {
  const navigate = useNavigate()
  const { user, axios, fetchUser } = useAppContext()

  const [formData, setFormData] = useState({
    idProof: null,
    drivingLicense: null,
    profilePhoto: null,
    addressProof: null
  })

  const [previews, setPreviews] = useState({
    idProof: null,
    drivingLicense: null,
    profilePhoto: null,
    addressProof: null
  })

  const [loading, setLoading] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)
  const fileInputs = {
    idProof: useRef(null),
    drivingLicense: useRef(null),
    profilePhoto: useRef(null),
    addressProof: useRef(null)
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }))
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviews(prev => ({ ...prev, [fieldName]: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.idProof || !formData.drivingLicense || !formData.profilePhoto) {
      toast.error('ID Proof, Driving License, and Profile Photo are required')
      return
    }

    setLoading(true)
    try {
      const kycData = new FormData()
      kycData.append('idProof', formData.idProof)
      kycData.append('drivingLicense', formData.drivingLicense)
      kycData.append('profilePhoto', formData.profilePhoto)
      if (formData.addressProof) {
        kycData.append('addressProof', formData.addressProof)
      }

      const { data } = await axios.post('/api/kyc/submit', kycData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.success) {
        toast.success(data.message)
        await fetchUser()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit KYC')
    } finally {
      setLoading(false)
    }
  }

  // Render processing state
  if (user?.isKycSubmitted && !user?.isKycApproved) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-white to-slate-50 px-6 md:px-16 lg:px-24 xl:px-32 py-16 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='max-w-2xl w-full'
        >
          <div className='rounded-[28px] border border-borderColor bg-white p-12 text-center shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
            {/* Animated Processing Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className='w-20 h-20 rounded-full border-4 border-[#7FFF00]/20 border-t-[#7FFF00] mx-auto mb-6'
            />

            <h1 className='text-4xl font-bold text-slate-900 mb-4'>
              KYC Under Review
            </h1>
            <p className='text-gray-600 text-lg mb-2'>
              Your KYC documents have been received
            </p>
            <p className='text-gray-500 mb-8'>
              Our admin team is reviewing your submission. This usually takes 24-48 hours. We'll notify you once your KYC is approved.
            </p>

            {/* Status Timeline */}
            <div className='rounded-[20px] border border-borderColor bg-slate-50 p-8 mb-8'>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-[#7FFF00] flex items-center justify-center text-black font-bold flex-shrink-0'>
                    ✓
                  </div>
                  <div className='text-left'>
                    <p className='font-semibold text-slate-900'>Documents Submitted</p>
                    <p className='text-gray-600 text-sm'>Your KYC documents are with us</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold flex-shrink-0 animate-pulse'>
                    ⏳
                  </div>
                  <div className='text-left'>
                    <p className='font-semibold text-slate-900'>Admin Review In Progress</p>
                    <p className='text-gray-600 text-sm'>We're verifying your documents</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold flex-shrink-0'>
                    ✓
                  </div>
                  <div className='text-left'>
                    <p className='font-semibold text-slate-900'>Approval</p>
                    <p className='text-gray-600 text-sm'>You'll be able to list cars once approved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className='grid gap-4 mb-8'>
              <div className='rounded-[20px] border border-blue-200 bg-blue-50 p-6'>
                <div className='flex gap-3'>
                  <span className='text-2xl'>📧</span>
                  <div className='text-left'>
                    <p className='font-semibold text-blue-900'>Email Notification</p>
                    <p className='text-blue-700 text-sm'>We'll send you an email once your KYC is approved</p>
                  </div>
                </div>
              </div>

              <div className='rounded-[20px] border border-purple-200 bg-purple-50 p-6'>
                <div className='flex gap-3'>
                  <span className='text-2xl'>⏱️</span>
                  <div className='text-left'>
                    <p className='font-semibold text-purple-900'>Expected Timeline</p>
                    <p className='text-purple-700 text-sm'>24-48 hours for admin review and verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='rounded-full border border-borderColor bg-slate-50 px-8 py-3 text-gray-700 font-semibold transition hover:bg-white w-full'
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render approved state
  if (user?.isKycApproved) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-white to-slate-50 px-6 md:px-16 lg:px-24 xl:px-32 py-16 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='max-w-2xl w-full'
        >
          <div className='rounded-[28px] border border-borderColor bg-white p-12 text-center shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className='w-20 h-20 rounded-full bg-[#7FFF00]/20 flex items-center justify-center mx-auto mb-6 border-2 border-[#7FFF00]'
            >
              <span className='text-4xl'>✓</span>
            </motion.div>

            <h1 className='text-4xl font-bold text-slate-900 mb-4'>
              KYC Approved!
            </h1>
            <p className='text-gray-600 text-lg mb-8'>
              Congratulations! Your KYC has been approved. You can now start listing cars on our platform.
            </p>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <motion.button
                onClick={() => navigate('/owner')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex-1 rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00]'
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex-1 rounded-full border border-borderColor bg-white px-8 py-3 text-gray-700 font-semibold transition hover:bg-slate-50'
              >
                Back to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-slate-50 px-6 md:px-16 lg:px-24 xl:px-32 py-16'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-4xl mx-auto'
      >
        <div className='mb-8'>
          <BackButton />
        </div>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-slate-900 mb-4'>
            KYC Verification
          </h1>
          <p className='text-gray-600 text-lg'>
            Complete your KYC to start listing cars on our platform
          </p>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='rounded-[28px] border border-borderColor bg-blue-50 p-6 mb-10'
        >
          <div className='flex gap-4'>
            <div className='text-blue-600 text-2xl'>ℹ️</div>
            <div>
              <h3 className='font-semibold text-slate-900 mb-2'>Why KYC?</h3>
              <p className='text-gray-600 text-sm'>
                KYC (Know Your Customer) verification helps us maintain trust and security on our platform. This is a one-time process required for all car owners.
              </p>
            </div>
          </div>
        </motion.div>

        {user?.isKycRejected && !isResubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className='rounded-[28px] border border-red-200 bg-red-50 p-8 mb-10'
          >
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='text-red-600 text-3xl'>⚠️</div>
                <div>
                  <h3 className='text-xl font-semibold text-red-900'>KYC Rejected</h3>
                  <p className='text-gray-700'>
                    Your previous KYC submission was rejected. Please review the reason below, then resubmit with updated documents.
                  </p>
                </div>
              </div>

              <div className='rounded-[20px] border border-red-200 bg-red-100 p-5'>
                <h4 className='font-semibold text-red-900 mb-2'>Reason for Rejection</h4>
                <p className='text-red-800'>{user.kycRejectionReason}</p>
              </div>

              <motion.button
                onClick={() => setIsResubmitting(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00] w-full'
              >
                Resubmit KYC
              </motion.button>
            </div>
          </motion.div>
        )}

        {(!user?.isKycRejected || isResubmitting) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='rounded-[28px] border border-borderColor bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'
          >
            <form onSubmit={handleSubmit} className='space-y-8'>
            {/* ID Proof */}
            <div>
              <label className='block text-sm font-semibold text-slate-900 mb-3'>
                ID Proof <span className='text-red-500'>*</span>
              </label>
              <p className='text-gray-600 text-xs mb-4'>Accepted formats: Aadhaar, PAN, Passport (PDF/Image)</p>
              
              <div
                onClick={() => fileInputs.idProof.current?.click()}
                className='border-2 border-dashed border-borderColor rounded-[20px] p-8 text-center cursor-pointer hover:border-primary hover:bg-slate-50 transition'
              >
                {previews.idProof ? (
                  <div className='space-y-3'>
                    <img src={previews.idProof} alt='ID Proof Preview' className='w-32 h-32 object-cover mx-auto rounded-lg' />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData(prev => ({ ...prev, idProof: null }))
                        setPreviews(prev => ({ ...prev, idProof: null }))
                      }}
                      className='text-xs text-red-600 hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className='text-4xl mb-2'>📄</div>
                    <p className='text-gray-700 font-medium'>Click to upload</p>
                    <p className='text-gray-500 text-sm mt-1'>or drag and drop</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputs.idProof}
                type='file'
                onChange={(e) => handleFileChange(e, 'idProof')}
                className='hidden'
                accept='image/*,.pdf'
              />
            </div>

            {/* Driving License */}
            <div>
              <label className='block text-sm font-semibold text-slate-900 mb-3'>
                Driving License <span className='text-red-500'>*</span>
              </label>
              <p className='text-gray-600 text-xs mb-4'>Front and back side (If possible)</p>
              
              <div
                onClick={() => fileInputs.drivingLicense.current?.click()}
                className='border-2 border-dashed border-borderColor rounded-[20px] p-8 text-center cursor-pointer hover:border-primary hover:bg-slate-50 transition'
              >
                {previews.drivingLicense ? (
                  <div className='space-y-3'>
                    <img src={previews.drivingLicense} alt='Driving License Preview' className='w-32 h-32 object-cover mx-auto rounded-lg' />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData(prev => ({ ...prev, drivingLicense: null }))
                        setPreviews(prev => ({ ...prev, drivingLicense: null }))
                      }}
                      className='text-xs text-red-600 hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className='text-4xl mb-2'>🚗</div>
                    <p className='text-gray-700 font-medium'>Click to upload</p>
                    <p className='text-gray-500 text-sm mt-1'>or drag and drop</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputs.drivingLicense}
                type='file'
                onChange={(e) => handleFileChange(e, 'drivingLicense')}
                className='hidden'
                accept='image/*,.pdf'
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className='block text-sm font-semibold text-slate-900 mb-3'>
                Profile Photo <span className='text-red-500'>*</span>
              </label>
              <p className='text-gray-600 text-xs mb-4'>Clear face photo (JPG/PNG, Max 5MB)</p>
              
              <div
                onClick={() => fileInputs.profilePhoto.current?.click()}
                className='border-2 border-dashed border-borderColor rounded-[20px] p-8 text-center cursor-pointer hover:border-primary hover:bg-slate-50 transition'
              >
                {previews.profilePhoto ? (
                  <div className='space-y-3'>
                    <img src={previews.profilePhoto} alt='Profile Photo Preview' className='w-32 h-32 object-cover mx-auto rounded-full' />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData(prev => ({ ...prev, profilePhoto: null }))
                        setPreviews(prev => ({ ...prev, profilePhoto: null }))
                      }}
                      className='text-xs text-red-600 hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className='text-4xl mb-2'>📸</div>
                    <p className='text-gray-700 font-medium'>Click to upload</p>
                    <p className='text-gray-500 text-sm mt-1'>or drag and drop</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputs.profilePhoto}
                type='file'
                onChange={(e) => handleFileChange(e, 'profilePhoto')}
                className='hidden'
                accept='image/*'
              />
            </div>

            {/* Address Proof (Optional) */}
            <div>
              <label className='block text-sm font-semibold text-slate-900 mb-3'>
                Address Proof <span className='text-gray-500 text-xs'>(Optional)</span>
              </label>
              <p className='text-gray-600 text-xs mb-4'>Utility bill, Bank statement, or Voter ID</p>
              
              <div
                onClick={() => fileInputs.addressProof.current?.click()}
                className='border-2 border-dashed border-borderColor rounded-[20px] p-8 text-center cursor-pointer hover:border-primary hover:bg-slate-50 transition'
              >
                {previews.addressProof ? (
                  <div className='space-y-3'>
                    <img src={previews.addressProof} alt='Address Proof Preview' className='w-32 h-32 object-cover mx-auto rounded-lg' />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData(prev => ({ ...prev, addressProof: null }))
                        setPreviews(prev => ({ ...prev, addressProof: null }))
                      }}
                      className='text-xs text-red-600 hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className='text-4xl mb-2'>🏠</div>
                    <p className='text-gray-700 font-medium'>Click to upload</p>
                    <p className='text-gray-500 text-sm mt-1'>or drag and drop</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputs.addressProof}
                type='file'
                onChange={(e) => handleFileChange(e, 'addressProof')}
                className='hidden'
                accept='image/*,.pdf'
              />
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-6'>
              <motion.button
                type='submit'
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex-1 rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Submitting...' : 'Submit KYC'}
              </motion.button>
            </div>
          </form>
        </motion.div>
        )}

        {/* Timeline Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mt-12 rounded-[28px] border border-borderColor bg-white p-8'
        >
          <h3 className='text-xl font-bold text-slate-900 mb-6'>What happens next?</h3>
          <div className='space-y-4'>
            <div className='flex gap-4'>
              <div className='w-8 h-8 rounded-full bg-[#7FFF00]/20 flex items-center justify-center font-bold text-[#7FFF00] flex-shrink-0'>1</div>
              <div>
                <p className='font-semibold text-slate-900'>Submit Documents</p>
                <p className='text-gray-600 text-sm'>Upload your KYC documents</p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='w-8 h-8 rounded-full bg-[#7FFF00]/20 flex items-center justify-center font-bold text-[#7FFF00] flex-shrink-0'>2</div>
              <div>
                <p className='font-semibold text-slate-900'>Admin Review</p>
                <p className='text-gray-600 text-sm'>Our admin team will verify your documents (24-48 hours)</p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='w-8 h-8 rounded-full bg-[#7FFF00]/20 flex items-center justify-center font-bold text-[#7FFF00] flex-shrink-0'>3</div>
              <div>
                <p className='font-semibold text-slate-900'>Approval & Go Live</p>
                <p className='text-gray-600 text-sm'>Once approved, you can start listing cars</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OwnerKYC
