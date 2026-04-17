import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import BackButton from '../components/BackButton'

const faqs = [
  {
    question: 'How to book a car?',
    answer: 'Choose your desired car, pick your location and dates, then submit the booking form. After confirmation, proceed to payment to reserve your rental.',
  },
  {
    question: 'How to cancel booking?',
    answer: 'Open My Bookings, select the booking you want to cancel, and follow the cancel option. Cancellation rules depend on the booking status and the policy at checkout.',
  },
  {
    question: 'Payment issues',
    answer: 'If payment fails, double-check your card details and try again. For persistent issues, contact support with your booking reference.',
  },
  {
    question: 'Refund policy',
    answer: 'Refunds are issued based on the cancellation policy and booking status. Eligible refunds usually appear in your account within 5-7 business days.',
  },
]

const categories = [
  { title: 'Booking', description: 'Questions about booking, pickup and return flow.' },
  { title: 'Payments', description: 'Payment methods, refunds and invoice support.' },
  { title: 'Account', description: 'Profile, login, and account management help.' },
  { title: 'Cars', description: 'Vehicle details, availability and features.' },
]

const HelpCenter = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqs
    return faqs.filter((item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all contact fields.')
      return
    }
    toast.success('Support request sent. We will get back to you soon.')
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto'
      >
        <div className='mb-8'>
          <BackButton />
        </div>
        <div className='bg-white rounded-[32px] p-8 md:p-12 shadow-[0_25px_60px_rgba(15,23,42,0.08)]'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3'>Help Center</p>
              <h1 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>Find answers fast and get help when you need it.</h1>
              <p className='mt-4 text-gray-500 max-w-2xl'>Browse FAQs, search questions, or send a support message directly from this page.</p>
            </div>
            <button
              onClick={() => navigate('/my-bookings')}
              className='inline-flex items-center gap-2 rounded-full bg-[#7FFF00] px-6 py-3 text-black font-medium shadow-sm shadow-[#7FFF00]/20 hover:bg-[#6fdc00] transition'
            >
              <img src={assets.arrow_icon} alt='' className='w-4 rotate-180' />
              Go to My Bookings
            </button>
          </div>

          <div className='mt-8 grid gap-4 md:grid-cols-[1fr_320px] items-start'>
            <div className='bg-slate-50 rounded-3xl p-5 border border-borderColor'>
              <div className='flex items-center gap-3 text-gray-700'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm'>
                  <img src={assets.search_icon} alt='Search' className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Search support</p>
                  <h2 className='text-xl font-semibold'>Search questions</h2>
                </div>
              </div>
              <div className='mt-5'>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type='text'
                  placeholder='Search by keyword or topic'
                  className='w-full rounded-3xl border border-borderColor bg-white px-5 py-4 text-gray-700 outline-none transition focus:border-black'
                />
              </div>
            </div>

            <div className='rounded-3xl border border-borderColor bg-white p-5 shadow-sm'>
              <h3 className='text-lg font-semibold text-slate-900'>Quick Actions</h3>
              <p className='mt-2 text-gray-500'>Jump straight to the most common support flows.</p>
              <div className='mt-5 grid gap-3'>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className='w-full rounded-2xl border border-borderColor bg-slate-50 px-4 py-3 text-left text-gray-700 transition hover:border-black hover:bg-white'
                >
                  <p className='font-medium'>Go to My Bookings</p>
                  <p className='text-sm text-gray-500 mt-1'>View active bookings and cancellations.</p>
                </button>
                <a
                  href='mailto:support@rentocar.com'
                  className='w-full rounded-2xl border border-borderColor bg-slate-50 px-4 py-3 text-left text-gray-700 transition hover:border-black hover:bg-white'
                >
                  <p className='font-medium'>Contact Admin</p>
                  <p className='text-sm text-gray-500 mt-1'>Send a message to the support team.</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]'>
          <section className='space-y-8'>
            <div className='rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='text-sm uppercase tracking-[0.2em] text-primary font-semibold'>Categories</p>
                  <h2 className='text-3xl font-bold text-slate-900'>Browse by topic</h2>
                </div>
                <p className='text-gray-500 max-w-md'>Quickly filter support content by the topic you need.</p>
              </div>

              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                {categories.map((category) => (
                  <motion.div
                    key={category.title}
                    whileHover={{ y: -4 }}
                    className='rounded-3xl border border-borderColor bg-slate-50 p-5 transition'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-lg font-semibold text-slate-900'>{category.title}</p>
                        <p className='mt-2 text-gray-500'>{category.description}</p>
                      </div>
                      <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm'>
                        <img src={assets.check_icon} alt='' className='w-4 h-4' />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className='rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
              <p className='text-sm uppercase tracking-[0.2em] text-primary font-semibold'>FAQ</p>
              <h2 className='text-3xl font-bold text-slate-900 mt-3'>Frequently asked questions</h2>
              <p className='mt-3 text-gray-500 max-w-2xl'>Need help? Use the search above or expand any topic to see a fast answer.</p>

              <div className='mt-8 space-y-4'>
                {filteredFaqs.map((item, index) => (
                  <motion.div
                    key={item.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className='overflow-hidden rounded-[28px] border border-borderColor bg-slate-50'
                  >
                    <button
                      type='button'
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className='flex w-full items-center justify-between gap-4 px-6 py-5 text-left'
                    >
                      <div>
                        <p className='text-base font-semibold text-slate-900'>{item.question}</p>
                        <p className='mt-2 text-sm text-gray-500'>{item.answer.substring(0, 80)}...</p>
                      </div>
                      <span className='text-2xl text-primary'>{activeFaq === index ? '−' : '+'}</span>
                    </button>
                    {activeFaq === index && (
                      <div className='px-6 pb-6 text-gray-600'>{item.answer}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <aside className='space-y-8'>
            <div className='rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]'>
              <p className='text-sm uppercase tracking-[0.2em] text-primary font-semibold'>Contact Support</p>
              <h2 className='text-3xl font-bold text-slate-900 mt-3'>Send us a message</h2>
              <p className='mt-3 text-gray-500'>We typically reply within 24 hours.</p>

              <form onSubmit={handleContactSubmit} className='mt-8 space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700'>Name</label>
                  <input
                    name='name'
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className='w-full rounded-3xl border border-borderColor bg-slate-50 px-4 py-3 text-gray-700 outline-none transition focus:border-black'
                    placeholder='Your name'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700'>Email</label>
                  <input
                    name='email'
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className='w-full rounded-3xl border border-borderColor bg-slate-50 px-4 py-3 text-gray-700 outline-none transition focus:border-black'
                    placeholder='you@example.com'
                    type='email'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700'>Message</label>
                  <textarea
                    name='message'
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows='5'
                    className='w-full rounded-3xl border border-borderColor bg-slate-50 px-4 py-3 text-gray-700 outline-none transition focus:border-black'
                    placeholder='Describe your issue or question'
                  />
                </div>
                <button type='submit' className='w-full rounded-full bg-[#7FFF00] px-6 py-3 text-black font-semibold transition hover:bg-[#6fdc00]'>
                  Submit Request
                </button>
              </form>
            </div>

            <div className='rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-[0_20px_80px_rgba(15,23,42,0.25)]'>
              <p className='text-sm uppercase tracking-[0.2em] text-[#7FFF00] font-semibold'>Need urgent help?</p>
              <h3 className='mt-4 text-3xl font-bold'>Contact our team directly</h3>
              <p className='mt-4 text-sm text-slate-300'>Our support agents are available to help with bookings, payments, and account issues.</p>
              <div className='mt-8 space-y-3'>
                <div className='rounded-3xl bg-white/10 px-5 py-4'>
                  <p className='text-sm text-slate-300'>Email</p>
                  <p className='mt-1 font-medium'>support@rentocar.com</p>
                </div>
                <div className='rounded-3xl bg-white/10 px-5 py-4'>
                  <p className='text-sm text-slate-300'>Phone</p>
                  <p className='mt-1 font-medium'>+1 234 567 8900</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  )
}

export default HelpCenter
