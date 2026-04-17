import React from 'react'
import { motion } from 'motion/react'
import BackButton from '../components/BackButton'

const Insurance = () => {
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
          <h1 className='text-4xl font-bold text-slate-900'>Insurance Policy</h1>
          <p className='mt-4 text-gray-500 leading-relaxed'>Learn how our insurance coverage works during your rental period and what is expected from every renter.</p>

          <div className='mt-10 space-y-8'>
            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Coverage</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Our insurance policy includes basic liability coverage for all rentals, protecting against third-party damages. Coverage details may vary by vehicle and rental plan, so please review your booking confirmation for exact terms.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>User Responsibility</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Renters are responsible for driving safely and following all traffic regulations during the rental period. Any damage caused by negligence, unauthorized drivers, or prohibited use may not be covered by insurance.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Claim Process</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>If an incident occurs, report it immediately to our support team and follow the instructions provided. You may need to submit photos, police reports, and rental details to complete the claim process.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Limitations</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Insurance does not cover intentional damage, theft due to negligence, off-road use, or violations of the rental agreement. Check the full terms and conditions for exclusions before you drive.</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default Insurance
