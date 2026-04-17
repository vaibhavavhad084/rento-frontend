import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext'

const Footer = () => {
  const { isOwner } = useAppContext()
  const navigate = useNavigate()

  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            
            className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div>
                    <motion.img 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}

                    src={assets.logo} alt="logo" className='h-8 md:h-9' />

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}

                    className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    
                    className='flex items-center gap-3 mt-6'>
                        <a href="#"> <img src={assets.facebook_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.instagram_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.twitter_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.gmail_logo} className='w-5 h-5' alt="" /> </a>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}

                className='flex flex-wrap justify-between w-1/2 gap-8'>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/cars'>Browse Cars</Link></li>
                        <li>
                          {isOwner ? (
                            <button
                              type='button'
                              onClick={() => navigate('/owner/add-car')}
                              className='text-left text-gray-600 hover:text-black transition'
                            >
                              List Your Car
                            </button>
                          ) : (
                            <span className='text-gray-500 cursor-default'>List Your Car</span>
                          )}
                        </li>
                        <li><Link to='/about'>About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to='/help-center'>Help Center</Link></li>
                        <li><Link to='/terms'>Terms</Link></li>
                        <li><Link to='/privacy-policy'>Privacy Policy</Link></li>
                        <li><Link to='/insurance'>Insurance</Link></li>
                        
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>Flat 402, Marvel Edge</li>
                        <li>Viman Nagar, Pune, MH 411014</li>
                        <li>+91 20 4012 3456</li>
                        <li>contact@punerentals.in</li>
                    </ul>
                </div>

                </motion.div>
                

                  
                

            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                
            className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><Link to='/privacy-policy'>Privacy</Link></li>
                    <li>|</li>
                    <li><Link to='/terms'>Terms</Link></li>
                    <li>|</li>
                    <li><Link to='/cookies'>Cookies</Link></li>
                </ul>
            </motion.div>
        </motion.div>
  )
}

export default Footer
