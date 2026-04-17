import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../components/owner/Title'

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

const Bookings = () => {
  const { axios } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState('')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/bookings')
      if (data.success) {
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

  const handleAction = async (endpoint, bookingId) => {
    setProcessing(bookingId)
    try {
      const { data } = await axios.patch(endpoint)
      if (data.success) {
        toast.success(data.message)
        fetchBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing('')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div>
      <Title title='Bookings Management' subTitle='Review every booking and manage booking lifecycle from pending to completed.' />

      <div className='mt-8 overflow-x-auto rounded-xl border border-borderColor bg-white shadow-sm'>
        <table className='min-w-full text-left'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>User</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Car</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Dates</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Status</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Payment</th>                <th className='px-6 py-4 text-sm font-medium text-gray-500'>Refund</th>              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Price</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Documents</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='8' className='px-6 py-8 text-center text-gray-500'>Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan='8' className='px-6 py-8 text-center text-gray-500'>No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const canConfirm = booking.status === 'pending' && booking.paymentStatus === 'paid'
                const canStart = booking.status === 'confirmed'
                const canComplete = booking.status === 'ongoing'
                const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed'

                return (
                  <tr key={booking._id} className='border-t border-borderColor'>
                    <td className='px-6 py-4'>
                      <div className='font-medium'>{booking.user?.name || 'Unknown'}</div>
                      <div className='text-sm text-gray-500'>{booking.user?.email || 'No email'}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='font-medium'>{booking.car?.brand} {booking.car?.model}</div>
                      <div className='text-sm text-gray-500'>Price/day: {booking.car?.pricePerDay || '-'}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div>{new Date(booking.pickupDate).toLocaleDateString()}</div>
                      <div className='text-sm text-gray-500'>{new Date(booking.returnDate).toLocaleDateString()}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm ${statusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm ${paymentBadgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {booking.refundStatus && booking.refundStatus !== 'none' ? (
                        <div className='space-y-1'>
                          <span className={`inline-flex rounded-full px-3 py-1 text-sm ${refundBadgeClass(booking.refundStatus)}`}>
                            {booking.refundStatus}
                          </span>
                          {booking.refundAmount ? (
                            <div className='text-sm text-gray-500'>₹{booking.refundAmount}</div>
                          ) : null}
                        </div>
                      ) : (
                        <span className='text-sm text-gray-500'>None</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>₹{booking.price}</td>
                    <td className='px-6 py-4'>
                      {booking.documents && booking.documents.length > 0 ? (
                        <div className='space-y-1'>
                          {booking.documents.map((doc, index) => (
                            <a key={index} href={doc.url || doc} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline text-sm'>
                              {doc.type === 'aadhar' ? 'Aadhar Card' :
                               doc.type === 'voterId' ? 'Voter ID' :
                               doc.type === 'panCard' ? 'PAN Card' :
                               doc.type === 'drivingLicense' ? 'Driving License' :
                               doc.type === 'passport' ? 'Passport' :
                               doc.type === 'internationalDrivingLicense' ? 'International Driving License' :
                               doc.type === 'visa' ? 'Visa' :
                               doc.name || `Document ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className='text-gray-400'>No documents</span>
                      )}
                    </td>
                    <td className='px-6 py-4 space-y-2'>
                      <button
                        onClick={() => handleAction(`/api/admin/booking/confirm/${booking._id}`, booking._id)}
                        disabled={!canConfirm || processing === booking._id}
                        className='w-full rounded-lg bg-[#7FFF00] px-3 py-2 text-sm font-medium text-black hover:bg-[#6fdc00] transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleAction(`/api/admin/booking/start/${booking._id}`, booking._id)}
                        disabled={!canStart || processing === booking._id}
                        className='w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >
                        Start Trip
                      </button>
                      <button
                        onClick={() => handleAction(`/api/admin/booking/reject/${booking._id}`, booking._id)}
                        disabled={processing === booking._id || booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'rejected'}
                        className='w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(`/api/admin/booking/complete/${booking._id}`, booking._id)}
                        disabled={!canComplete || processing === booking._id}
                        className='w-full rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >
                        Complete Trip
                      </button>
                      <button
                        onClick={() => handleAction(`/api/admin/booking/cancel/${booking._id}`, booking._id)}
                        disabled={!canCancel || processing === booking._id}
                        className='w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bookings
