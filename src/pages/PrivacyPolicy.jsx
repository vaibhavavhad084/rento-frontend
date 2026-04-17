import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import BackButton from '../components/BackButton'

const sections = [
  {
    title: 'Introduction',
    content: 'Welcome to our Privacy Policy. We value your privacy and are committed to protecting your personal information while you use our car rental platform.',
  },
  {
    title: 'Information We Collect',
    content: 'We collect information you provide during booking, account registration, and support inquiries. This may include name, email, contact details, payment details, and rental preferences.',
  },
  {
    title: 'How We Use Information',
    content: 'We use collected data to process bookings, improve service quality, communicate with you, and personalize your experience. We do not sell your personal information to third parties.',
  },
  {
    title: 'Cookies Policy',
    content: 'We use cookies and similar technologies to enhance website functionality, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser.',
  },
  {
    title: 'Data Protection',
    content: 'We implement security measures to safeguard your data from unauthorized access, modification, and disclosure. Your information is stored securely and accessed only by authorized personnel.',
  },
  {
    title: 'Third Party Sharing',
    content: 'We may share your information with trusted partners to complete bookings and provide customer support. Any sharing is limited to the purpose of service delivery and governed by confidentiality.',
  },
  {
    title: 'User Rights',
    content: 'You have the right to access, correct, or delete your personal data. You may also request details about how we process your information by contacting our support team.',
  },
  {
    title: 'Contact Information',
    content: 'If you have questions about this policy, please reach out to us at contact@punerentals.in or call +91 20 4012 3456.',
  },
]

const PrivacyPolicy = () => {
  const navigate = useNavigate()

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
          <div className='max-w-3xl'>
            <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-4'>Privacy Policy</p>
            <h1 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>Your privacy is important to us.</h1>
            <p className='mt-6 text-gray-500 leading-relaxed'>This policy explains how we collect, use, protect, and share your information when you use our car rental services.</p>
            <button
              onClick={() => navigate('/cars')}
              className='mt-8 rounded-full bg-[#7FFF00] px-8 py-3 text-black font-semibold shadow-sm shadow-[#7FFF00]/20 transition hover:bg-[#6fdc00]'
            >
              Explore Cars
            </button>
          </div>
        </section>

        <section className='mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div className='space-y-8'>
            {sections.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='rounded-[28px] border border-borderColor bg-white p-8 shadow-sm'
              >
                <h2 className='text-2xl font-semibold text-slate-900'>{section.title}</h2>
                <p className='mt-4 text-gray-500 leading-relaxed'>{section.content}</p>
              </motion.div>
            ))}
          </div>

          <aside className='rounded-[32px] bg-slate-50 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
            <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold'>Policy Snapshot</p>
            <h2 className='text-3xl font-bold text-slate-900 mt-3'>What you should know</h2>
            <ul className='mt-6 space-y-4 text-gray-500'>
              <li className='rounded-3xl bg-white p-4 shadow-sm'>We only use data to improve service and complete bookings.</li>
              <li className='rounded-3xl bg-white p-4 shadow-sm'>Cookies help us personalize your experience.</li>
              <li className='rounded-3xl bg-white p-4 shadow-sm'>You can request data access or deletion anytime.</li>
            </ul>
          </aside>
        </section>
      </motion.div>
    </div>
  )
}

export default PrivacyPolicy
