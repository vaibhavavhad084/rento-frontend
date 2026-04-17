import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import BackButton from '../components/BackButton'

const features = [
  { title: 'Affordable prices', description: 'Transparent pricing with no hidden fees so you can rent with confidence.' },
  { title: 'Wide range of cars', description: 'Choose from luxury, SUV, sedan and budget-friendly cars for every trip.' },
  { title: 'Easy booking', description: 'Fast search, date selection, and checkout for a smooth rental experience.' },
  { title: 'Trusted service', description: 'Reliable customer support and maintained vehicles for every booking.' },
]

const stats = [
  { value: '120+', label: 'Cars available' },
  { value: '8.5K', label: 'Happy customers' },
  { value: '18', label: 'Cities served' },
]

const team = [
  { name: 'Amit Sharma', role: 'Founder & CEO' },
  { name: 'Priya Patel', role: 'Operations Lead' },
  { name: 'Rohan Verma', role: 'Customer Success' },
]

const About = () => {
  const navigate = useNavigate()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto'
      >
        <div className='mb-8'>
          <BackButton />
        </div>
        <section className='rounded-[32px] bg-white p-8 md:p-12 shadow-[0_25px_60px_rgba(15,23,42,0.08)]'>
          <div className='grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center'>
            <div>
              <p className='text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-4'>About Us</p>
              <h1 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>Your trusted partner for seamless car rentals.</h1>
              <p className='mt-6 text-gray-500 max-w-2xl'>We make renting a car easy, affordable, and reliable with a curated fleet, responsive support, and a smooth booking flow.</p>
              <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <button
                  onClick={() => navigate('/cars')}
                  className='rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00]'
                >
                  Explore Cars
                </button>
                <button
                  onClick={() => navigate('/help-center')}
                  className='rounded-full border border-borderColor bg-slate-50 px-8 py-3 text-gray-700 transition hover:border-black hover:bg-white'
                >
                  Visit Help Center
                </button>
              </div>
            </div>
            <div className='rounded-[32px] border border-borderColor bg-slate-50 p-6 shadow-sm'>
              <img src={assets.main_car} alt='About us car' className='w-full rounded-3xl object-cover' />
            </div>
          </div>
        </section>

        <section className='mt-12 grid gap-8 lg:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='rounded-[32px] border border-borderColor bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'
          >
            <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3'>What we do</p>
            <h2 className='text-3xl font-bold text-slate-900'>We help you rent the perfect car for every journey.</h2>
            <p className='mt-4 text-gray-500'>From city trips to weekend getaways, our platform connects you with well-maintained cars, transparent pricing, and instant support.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className='rounded-[32px] border border-borderColor bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'
          >
            <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3'>Mission & Vision</p>
            <h2 className='text-3xl font-bold text-slate-900'>Driven by convenience, quality, and trust.</h2>
            <div className='mt-4 space-y-4 text-gray-500'>
              <p><span className='font-semibold text-slate-900'>Mission:</span> Deliver a fast and user-friendly rental experience with the best fleet, pricing, and support.</p>
              <p><span className='font-semibold text-slate-900'>Vision:</span> Become the most trusted car rental service across cities by simplifying every travel plan.</p>
            </div>
          </motion.div>
        </section>

        <section className='mt-12'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='rounded-[28px] border border-borderColor bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition'
              >
                <p className='text-lg font-semibold text-slate-900'>{item.title}</p>
                <p className='mt-3 text-gray-500'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className='mt-12 rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {stats.map((item) => (
              <div key={item.label} className='rounded-3xl bg-white/10 p-7'>
                <p className='text-4xl font-bold'>{item.value}</p>
                <p className='mt-3 text-sm text-slate-300'>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-12'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3'>Team</p>
              <h2 className='text-3xl font-bold text-slate-900'>Meet the crew behind the service.</h2>
            </div>
            <button
              onClick={() => navigate('/help-center')}
              className='self-start rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00]'
            >
              Get Support
            </button>
          </div>

          <div className='mt-8 grid gap-6 md:grid-cols-3'>
            {team.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='rounded-[28px] border border-borderColor bg-white p-6 text-center shadow-sm'
              >
                <div className='mx-auto mb-5 h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl text-slate-700'>
                  {member.name.charAt(0)}
                </div>
                <p className='text-xl font-semibold text-slate-900'>{member.name}</p>
                <p className='mt-2 text-gray-500'>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default About
