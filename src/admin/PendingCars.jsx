import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../components/owner/Title'

const PendingCars = () => {
  const { axios } = useAppContext()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingCarId, setRejectingCarId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchPendingCars = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/pending-cars')
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

  const handleApprove = async (carId) => {
    setProcessing(carId)
    try {
      const { data } = await axios.put(`/api/admin/car/approve/${carId}`)
      if (data.success) {
        setCars((prev) => prev.filter((car) => car._id !== carId))
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing('')
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

    setProcessing(rejectingCarId)
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
    } finally {
      setProcessing('')
    }
  }

  useEffect(() => {
    fetchPendingCars()
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

      <Title title='Pending Car Verifications' subTitle='Review owner-submitted documents and approve or reject cars before they become visible to users.' />

      <div className='mt-8 grid gap-6'>
        {loading ? (
          <div className='rounded-xl border border-borderColor bg-white p-8 text-center text-gray-500'>Loading pending cars...</div>
        ) : cars.length === 0 ? (
          <div className='rounded-xl border border-borderColor bg-white p-8 text-center text-gray-500'>No pending cars found.</div>
        ) : (
          cars.map((car) => (
            <div key={car._id} className='rounded-xl border border-borderColor bg-white p-6 shadow-sm'>
              <div className='flex flex-col lg:flex-row gap-6'>
                <img src={car.image} alt={`${car.brand} ${car.model}`} className='h-56 w-full lg:w-64 object-cover rounded-lg' />
                <div className='flex-1 space-y-4'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <h2 className='text-xl font-semibold text-gray-800'>{car.brand} {car.model}</h2>
                        <p className='text-sm text-gray-500'>{car.category} • {car.year} • {car.transmission}</p>
                      </div>
                      <span className='inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800'>Pending</span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                      <div><span className='font-medium text-gray-700'>Price:</span> {car.pricePerDay}</div>
                      <div><span className='font-medium text-gray-700'>Location:</span> {car.location}</div>
                      <div><span className='font-medium text-gray-700'>Seats:</span> {car.seating_capacity}</div>
                      <div><span className='font-medium text-gray-700'>Fuel:</span> {car.fuel_type}</div>
                    </div>
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='rounded-xl border border-borderColor p-4'>
                      <h3 className='font-semibold text-gray-800 mb-2'>Documents</h3>
                      <div className='space-y-2 text-sm text-gray-600'>
                        <div>
                          <span className='font-medium'>RC:</span>{' '}
                          {car.documents?.rc ? (
                            <a href={car.documents.rc} target='_blank' rel='noreferrer' className='text-blue-500 underline'>View</a>
                          ) : 'Missing'}
                        </div>
                        <div>
                          <span className='font-medium'>Insurance:</span>{' '}
                          {car.documents?.insurance ? (
                            <a href={car.documents.insurance} target='_blank' rel='noreferrer' className='text-blue-500 underline'>View</a>
                          ) : 'Missing'}
                        </div>
                        <div>
                          <span className='font-medium'>PUC:</span>{' '}
                          {car.documents?.puc ? (
                            <a href={car.documents.puc} target='_blank' rel='noreferrer' className='text-blue-500 underline'>View</a>
                          ) : 'Missing'}
                        </div>
                      </div>
                    </div>

                    <div className='rounded-xl border border-borderColor p-4'>
                      <h3 className='font-semibold text-gray-800 mb-2'>Additional Images</h3>
                      <div className='grid grid-cols-3 gap-2'>
                        {car.images?.length > 0 ? car.images.map((img, index) => (
                          <img key={index} src={img} alt={`Car image ${index + 1}`} className='h-20 w-full object-cover rounded-md' />
                        )) : (
                          <span className='text-sm text-gray-500'>No extra images</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                    <button
                      onClick={() => handleRejectClick(car._id)}
                      disabled={processing === car._id}
                      className='rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:cursor-not-allowed disabled:bg-red-300'
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(car._id)}
                      disabled={processing === car._id}
                      className='rounded-lg bg-[#7FFF00] px-4 py-2 text-sm font-medium text-black hover:bg-[#6fdc00] transition disabled:cursor-not-allowed disabled:bg-lime-200'
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PendingCars
