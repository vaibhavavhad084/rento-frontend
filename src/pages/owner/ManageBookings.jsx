import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

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

const ManageBookings = () => {
  const { currency, axios } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [processing, setProcessing] = useState('')

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    setProcessing(bookingId)
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing('')
    }
  }

  const rejectBooking = async (bookingId) => {
    setProcessing(bookingId)
    try {
      const { data } = await axios.patch(`/api/bookings/reject/${bookingId}`, {reason: 'Rejected by owner'})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing('')
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <div className='w-full rounded-xl overflow-x-auto border border-borderColor mt-6 bg-white shadow-sm'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='bg-slate-50 text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Refund</th>
              <th className="p-3 font-medium">Documents</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index)=>(
              <tr key={booking._id} className='border-t border-borderColor text-gray-500'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                  <div>
                    <p className='font-medium'>{booking.car.brand} {booking.car.model}</p>
                    <p className='text-sm text-gray-500'>{booking.car.location}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>

                <td className='p-3'>{currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${paymentBadgeClass(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                </td>

                <td className='p-3'>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>

                <td className='p-3'>
                  {booking.refundStatus && booking.refundStatus !== 'none' ? (
                    <div className='space-y-1'>
                      <span className={`px-3 py-1 rounded-full text-xs ${refundBadgeClass(booking.refundStatus)}`}>
                        {booking.refundStatus}
                      </span>
                      {booking.refundAmount ? (
                        <div className='text-xs text-gray-500'>₹{booking.refundAmount}</div>
                      ) : null}
                    </div>
                  ) : (
                    <span className='text-xs text-gray-500'>None</span>
                  )}
                </td>

                <td className='p-3'>
                  {booking.documents && booking.documents.length > 0 ? (
                    <div className='space-y-1'>
                      {booking.documents.map((doc, index) => (
                        <a key={index} href={doc.url || doc} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline text-xs'>
                          {doc.type === 'aadhar' ? 'Aadhar Card' :
                           doc.type === 'voterId' ? 'Voter ID' :
                           doc.type === 'panCard' ? 'PAN Card' :
                           doc.type === 'drivingLicense' ? 'Driving License' :
                           doc.type === 'passport' ? 'Passport' :
                           doc.type === 'internationalDrivingLicense' ? 'International Driving License' :
                           doc.type === 'visa' ? 'Visa' :
                           doc.name || `Doc ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className='text-gray-400 text-xs'>None</span>
                  )}
                </td>

                <td className='p-3 space-y-2'>
                  {booking.status === 'pending' && booking.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                      disabled={processing === booking._id}
                      className='w-full rounded-lg bg-gray-500 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                    >Cancel Booking</button>
                  )}
                  {booking.status === 'pending' && booking.paymentStatus === 'paid' && (
                    <>
                      <button
                        onClick={() => changeBookingStatus(booking._id, 'confirmed')}
                        disabled={processing === booking._id}
                        className='w-full rounded-lg bg-[#7FFF00] px-3 py-2 text-sm font-medium text-black hover:bg-[#6fdc00] transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >Confirm</button>
                      <button
                        onClick={() => rejectBooking(booking._id)}
                        disabled={processing === booking._id}
                        className='w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                      >Reject</button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => changeBookingStatus(booking._id, 'ongoing')}
                      disabled={processing === booking._id}
                      className='w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                    >Start Trip</button>
                  )}
                  {booking.status === 'ongoing' && (
                    <button
                      onClick={() => changeBookingStatus(booking._id, 'completed')}
                      disabled={processing === booking._id}
                      className='w-full rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500'
                    >Complete Trip</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
