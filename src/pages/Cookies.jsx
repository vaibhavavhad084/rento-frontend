import React from 'react'
import { motion } from 'motion/react'
import BackButton from '../components/BackButton'

const Cookies = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16'>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto'
      >
        <div className='mb-8'>
          <BackButton />
        </div>
        <section className='rounded-[32px] bg-white p-8 md:p-12 shadow-[0_25px_60px_rgba(15,23,42,0.08)]'>
          <h1 className='text-4xl font-bold text-slate-900'>Cookies Policy</h1>
          <p className='mt-4 text-gray-500 leading-relaxed'>This page explains how we use cookies and similar technologies when you browse our car rental platform.</p>

          <div className='mt-10 space-y-8'>
            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>What are cookies</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Cookies are small text files stored on your device that help websites remember preferences and improve functionality. They make it easier to navigate the site and provide a more personalized experience.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>How we use cookies</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>We use cookies to remember your session, maintain your search preferences, and analyze traffic patterns. This helps us deliver a smoother booking process and improve site performance.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Managing cookies</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>You can manage or disable cookies through your browser settings. Keep in mind that disabling cookies may affect certain features and your overall experience on our platform.</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default Cookies
