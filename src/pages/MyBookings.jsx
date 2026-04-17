import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const statusBadgeClass = (status) => {
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
  if (status === 'confirmed') return 'bg-blue-100 text-blue-700'
  if (status === 'ongoing') return 'bg-purple-100 text-purple-700'
  if (status === 'completed') return 'bg-green-100 text-green-700'
  return 'bg-red-100 text-red-700'
}

const paymentBadgeClass = (paymentStatus) => {
  return paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
}

const refundBadgeClass = (refundStatus) => {
  if (refundStatus === 'processed') return 'bg-green-100 text-green-700'
  if (refundStatus === 'pending') return 'bg-yellow-100 text-yellow-700'
  return 'bg-slate-100 text-slate-600'
}

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState('')

  const fetchMyBookings = async ()=>{
    try {
      setLoading(true)
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    setProcessing(bookingId)
    try {
      const { data } = await axios.patch(`/api/bookings/cancel/${bookingId}`)
      if (data.success) {
        toast.success(data.message)
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing('')
    }
  }

  useEffect(()=>{
    if (user) fetchMyBookings()
  },[user])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >
      <Title title='My Bookings'
        subTitle='View and manage all your car bookings'
        align="left"
      />

      {loading ? (
        <div className='mt-8 rounded-xl border border-borderColor bg-white p-8 text-center text-gray-500 shadow-sm'>Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className='mt-8 rounded-xl border border-borderColor bg-white p-8 text-center text-gray-500 shadow-sm'>No bookings found.</div>
      ) : (
        <div className='space-y-6 mt-8'>
          {bookings.map((booking, index)=>(
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              key={booking._id}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl bg-white shadow-sm'
            >
              <div className='md:col-span-1'>
                <div className='rounded-lg overflow-hidden mb-3'>
                  <img src={booking.car?.image || assets.car_image1} alt="" className='w-full h-auto aspect-video object-cover'/>
                </div>
                <p className='text-lg font-semibold'>{booking.car?.brand || 'Unknown'} {booking.car?.model || ''}</p>
                <p className='text-gray-500'>{booking.car?.year || 'N/A'} • {booking.car?.category || 'N/A'}</p>
                <p className='text-gray-500'>{booking.car?.location || 'N/A'}</p>
              </div>

              <div className='md:col-span-2 space-y-4'>
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='px-3 py-1.5 bg-light rounded text-sm'>Booking #{index + 1}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${statusBadgeClass(booking.status)}`}>{booking.status}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${paymentBadgeClass(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='rounded-lg bg-slate-50 p-4'>
                    <p className='text-gray-500 text-sm'>Rental Period</p>
                    <p className='mt-1'>{booking.pickupDate ? booking.pickupDate.split('T')[0] : 'N/A'} to {booking.returnDate ? booking.returnDate.split('T')[0] : 'N/A'}</p>
                  </div>
                  <div className='rounded-lg bg-slate-50 p-4'>
                    <p className='text-gray-500 text-sm'>Booked On</p>
                    <p className='mt-1'>{booking.createdAt ? booking.createdAt.split('T')[0] : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className='md:col-span-1 flex flex-col justify-between gap-4'>
                <div className='text-right'>
                  <p className='text-sm text-gray-500'>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
                  {booking.refundStatus && booking.refundStatus !== 'none' && (
                    <div className='mt-2'>
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm ${refundBadgeClass(booking.refundStatus)}`}>
                        {booking.refundStatus}
                      </span>
                      {booking.refundStatus === 'processed' && (
                        <p className='text-sm text-gray-500 mt-2'>Refunded: {currency}{booking.refundAmount}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className='space-y-3'>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={processing === booking._id}
                      className='w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                    >Cancel Booking</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default MyBookings
