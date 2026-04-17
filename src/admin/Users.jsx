import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../components/owner/Title'

const roleOptions = ['user', 'owner', 'admin']

const Users = () => {
  const { axios } = useAppContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/users')
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

  const handleRoleUpdate = async (userId, role) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${userId}/role`, { role })
      if (data.success) {
        setUsers((prev) => prev.map((user) => (user._id === userId ? data.user : user)))
        toast.success('Role updated')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`)
      if (data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId))
        toast.success('User deleted')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      <Title title='Users Management' subTitle='View all accounts, change roles, or delete users safely.' />

      <div className='mt-8 overflow-x-auto rounded-xl border border-borderColor bg-white shadow-sm'>
        <table className='min-w-full text-left'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Name</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Email</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Role</th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='4' className='px-6 py-8 text-center text-gray-500'>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan='4' className='px-6 py-8 text-center text-gray-500'>No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className='border-t border-borderColor'>
                  <td className='px-6 py-4'>{user.name}</td>
                  <td className='px-6 py-4'>{user.email}</td>
                  <td className='px-6 py-4'>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      className='rounded-md border border-gray-200 p-2'
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className='px-6 py-4'>
                    <button onClick={() => handleDelete(user._id)} className='rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition'>Delete</button>
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

export default Users
