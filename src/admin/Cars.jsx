import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../components/owner/Title'

const Cars = () => {
  const { axios } = useAppContext()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingCarId, setRejectingCarId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchCars = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectClick = (carId) => {
    setRejectingCarId(carId)
    setShowRejectModal(true)
    setRejectionReason('')
  }

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const { data } = await axios.patch(`/api/admin/car/reject/${rejectingCarId}`, {
        reason: rejectionReason
      })
      if (data.success) {
        setCars((prev) => prev.filter((car) => car._id !== rejectingCarId))
        toast.success(data.message)
        setShowRejectModal(false)
        setRejectionReason('')
        setRejectingCarId(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject car')
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  return (
    <div>
      {showRejectModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>Reject Car</h2>
            <p className='mb-4 text-sm text-gray-600'>Please provide a reason for rejecting this car. The owner will receive an email with this reason.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder='Enter rejection reason...'
              className='w-full rounded-lg border border-borderColor p-3 focus:outline-none focus:ring-2 focus:ring-[#7FFF00]'
              rows='4'
            />
            <div className='mt-6 flex gap-3'>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setRejectingCarId(null)
                }}
                className='flex-1 rounded-lg border border-borderColor px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className='flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 transition disabled:opacity-50'
              >
                Reject Car
              </button>
            </div>
          </div>
        </div>
      )}

      <Title title='Cars Management' subTitle='Approve or remove cars and review owner details.' />

      <div className='mt-8 overflow-x-auto rounded-xl border border-borderColor bg-white shadow-sm'>
        <table className='min-w-full text-left'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Car</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Owner</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Price</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Approved</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Available</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>Loading cars...</td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>No cars available.</td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id} className='border-t border-borderColor'>
                  <td className='px-6 py-4'>
                    <div className='font-medium'>{car.brand} {car.model}</div>
                    <div className='text-sm text-gray-500'>{car.category} • {car.year}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div>{car.owner?.name || 'Unknown'}</div>
                    <div className='text-sm text-gray-500'>{car.owner?.email || 'No email'}</div>
                  </td>
                  <td className='px-6 py-4'>{car.pricePerDay}</td>
                  <td className='px-6 py-4'>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm ${car.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {car.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>{car.isAvaliable ? 'Yes' : 'No'}</td>
                  <td className='px-6 py-4 flex flex-wrap gap-2'>
                    <button onClick={() => handleRejectClick(car._id)} className='rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition'>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cars
