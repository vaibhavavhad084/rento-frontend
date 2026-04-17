import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/owner/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { axios, currency } = useAppContext()
  const [stats, setStats] = useState({ totalUsers: 0, totalCars: 0, totalBookings: 0, monthlyRevenue: 0 })

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: assets.users_icon },
    { title: 'Total Cars', value: stats.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: stats.totalBookings, icon: assets.listIconColored },
    { title: 'Monthly Revenue', value: `${currency}${stats.monthlyRevenue}`, icon: assets.listIconColored },
  ]

  const fetchAdminStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard')
      if (data.success) {
        setStats(data.stats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAdminStats()
  }, [])

  return (
    <div>
      <Title title='Admin Dashboard' subTitle='Monitor total users, cars, and bookings in a clean admin view.' />

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
        {cards.map((card, index) => (
          <div key={index} className='flex items-center justify-between p-5 rounded-xl border border-borderColor bg-white shadow-sm'>
            <div>
              <p className='text-sm text-gray-500'>{card.title}</p>
              <p className='text-3xl font-semibold mt-2'>{card.value}</p>
            </div>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#7FFF00]/15'>
              <img src={card.icon} alt={card.title} className='h-6 w-6' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
