import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../components/owner/Title'

const KYCRequests = () => {
  const { axios } = useAppContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchKYCRequests = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/kyc/requests')
      if (data.success) {
        setUsers(data.users)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    try {
      const { data } = await axios.patch(`/api/kyc/approve/${userId}`)
      if (data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId))
        toast.success('KYC Approved')
        setShowModal(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const { data } = await axios.patch(`/api/kyc/reject/${selectedUser._id}`, {
        reason: rejectionReason
      })
      if (data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id))
        toast.success('KYC Rejected')
        setShowModal(false)
        setShowRejectModal(false)
        setRejectionReason('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchKYCRequests()
  }, [])

  return (
    <div>
      <Title title='KYC Verification Requests' subTitle='Review and approve pending KYC submissions from users.' />

      <div className='mt-8 overflow-x-auto rounded-xl border border-borderColor bg-white shadow-sm'>
        <table className='min-w-full text-left'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Name</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Email</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Status</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Submitted Date</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>Loading requests...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>No pending KYC requests.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className='border-t border-borderColor hover:bg-slate-50'>
                  <td className='px-6 py-4 font-medium text-slate-900'>{user.name}</td>
                  <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                  <td className='px-6 py-4'>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700'>
                      <span className='h-2 w-2 rounded-full bg-yellow-500'></span>
                      Pending
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600'>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowModal(true)
                      }}
                      className='rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition'
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {showModal && selectedUser && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
            {/* Modal Header */}
            <div className='sticky top-0 border-b border-borderColor bg-white p-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-slate-900'>{selectedUser.name}</h2>
                  <p className='text-gray-600'>{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedUser(null)
                  }}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className='p-6 space-y-6'>
              {/* ID Proof */}
              {selectedUser.kyc?.idProof && (
                <div>
                  <h3 className='font-semibold text-slate-900 mb-3'>ID Proof</h3>
                  <div className='rounded-lg border border-borderColor overflow-hidden'>
                    <img
                      src={selectedUser.kyc.idProof}
                      alt='ID Proof'
                      className='w-full max-h-64 object-cover'
                    />
                  </div>
                </div>
              )}

              {/* Driving License */}
              {selectedUser.kyc?.drivingLicense && (
                <div>
                  <h3 className='font-semibold text-slate-900 mb-3'>Driving License</h3>
                  <div className='rounded-lg border border-borderColor overflow-hidden'>
                    <img
                      src={selectedUser.kyc.drivingLicense}
                      alt='Driving License'
                      className='w-full max-h-64 object-cover'
                    />
                  </div>
                </div>
              )}

              {/* Profile Photo */}
              {selectedUser.kyc?.profilePhoto && (
                <div>
                  <h3 className='font-semibold text-slate-900 mb-3'>Profile Photo</h3>
                  <div className='rounded-lg border border-borderColor overflow-hidden inline-block'>
                    <img
                      src={selectedUser.kyc.profilePhoto}
                      alt='Profile Photo'
                      className='w-40 h-40 object-cover'
                    />
                  </div>
                </div>
              )}

              {/* Address Proof */}
              {selectedUser.kyc?.addressProof && (
                <div>
                  <h3 className='font-semibold text-slate-900 mb-3'>Address Proof</h3>
                  <div className='rounded-lg border border-borderColor overflow-hidden'>
                    <img
                      src={selectedUser.kyc.addressProof}
                      alt='Address Proof'
                      className='w-full max-h-64 object-cover'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className='sticky bottom-0 border-t border-borderColor bg-slate-50 p-6 flex gap-4'>
              <button
                onClick={() => setShowRejectModal(true)}
                className='flex-1 rounded-lg border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700 hover:bg-red-100 transition'
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedUser._id)}
                className='flex-1 rounded-lg bg-[#7FFF00] px-6 py-3 font-semibold text-black hover:bg-[#6fdc00] transition'
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedUser && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white shadow-2xl'>
            {/* Modal Header */}
            <div className='border-b border-borderColor bg-white p-6'>
              <h2 className='text-xl font-bold text-slate-900'>Reject KYC</h2>
              <p className='text-gray-600 text-sm mt-1'>Please provide a reason for rejecting this KYC</p>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              <label className='block text-sm font-semibold text-slate-900 mb-3'>
                Rejection Reason <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Enter the reason for rejecting this KYC...'
                className='w-full border border-borderColor rounded-lg p-3 outline-none focus:border-[#7FFF00] resize-none'
                rows={4}
              />
              <p className='text-xs text-gray-500 mt-2'>This reason will be visible to the user</p>
            </div>

            {/* Modal Footer */}
            <div className='border-t border-borderColor bg-slate-50 p-6 flex gap-4'>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                className='flex-1 rounded-lg border border-borderColor bg-white px-6 py-2 font-semibold text-gray-700 hover:bg-slate-50 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className='flex-1 rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition'
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KYCRequests
