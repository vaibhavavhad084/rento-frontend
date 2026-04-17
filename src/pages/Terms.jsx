import React from 'react'
import { motion } from 'motion/react'
import BackButton from '../components/BackButton'

const Terms = () => {
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
          <h1 className='text-4xl font-bold text-slate-900'>Terms & Conditions</h1>
          <p className='mt-4 text-gray-500 leading-relaxed'>Review the terms that apply to all bookings, payments, cancellations, and user conduct on our platform.</p>

          <div className='mt-10 space-y-8'>
            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Booking Rules</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Bookings are subject to vehicle availability and confirmation. Reservations must be made with accurate information, and the renter is responsible for ensuring they meet all age and license requirements.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Payments</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Payments must be completed at the time of booking or as specified in the booking details. We accept the payment methods listed at checkout, and fees may apply for late payment or failed transactions.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>Cancellation Policy</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Cancellation terms depend on the chosen rental plan. Some bookings may be refundable with notice, while others may incur fees. Always review the cancellation policy shown during booking.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>User Conduct</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Users must behave responsibly and treat vehicles with care. Prohibited conduct includes theft, damage caused by reckless driving, unauthorized use, and violation of traffic rules or rental terms.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>For Indian Users</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>Indian citizens must provide valid identification documents such as Aadhar Card, Voter ID, or Passport for verification. Driving license issued in India is mandatory. Additional documents may be required based on the rental location and vehicle type.</p>
            </div>

            <div className='rounded-[28px] border border-borderColor bg-slate-50 p-8'>
              <h2 className='text-2xl font-semibold text-slate-900'>For International Tourists</h2>
              <p className='mt-4 text-gray-500 leading-relaxed'>International visitors must present a valid Passport and International Driving Permit (IDP) along with their original driving license. Additional requirements may include visa details and proof of address in India. Please ensure all documents are current and valid for the rental period.</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default Terms
