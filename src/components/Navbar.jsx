import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import ProfileDropdown from './ProfileDropdown'

const Navbar = () => {

    const { user, logout, isOwner, axios, setIsOwner } = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
                navigate('/owner')
            }else{
                if (data.needsKYC) {
                    toast.error(data.message)
                    navigate('/owner-kyc')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>

        <Link to='/'>
            <motion.img whileHover={{scale: 1.15}} src={assets.logo} alt="logo" className="h-8"/>
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks
                .filter(link => {
                    // Hide Home, Cars and My Bookings links when owner/admin is on change-password page
                    if (location.pathname === '/change-password' && (user?.role === 'owner' || user?.role === 'admin')) {
                        return link.name !== 'Home' && link.name !== 'Cars' && link.name !== 'My Bookings';
                    }
                    return true;
                })
                .map((link, index)=> (
                <Link key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}

            {/* Hide search bar when owner/admin is on change-password page */}
            {!(location.pathname === '/change-password' && (user?.role === 'owner' || user?.role === 'admin')) && (
                <>
                    <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                        <input type="text" className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" placeholder="Search cars"/>
                        <img src={assets.search_icon} alt="search" />
                    </div>
                </>
            )}

            <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                {user?.role === 'owner' && (
                  <button onClick={()=> navigate('/owner/dashboard')} className="cursor-pointer px-4 py-2 bg-[#7FFF00] hover:bg-[#6fdc00] transition-all text-black rounded-lg">
                    Dashboard
                  </button>
                )}
                {user?.role === 'user' && (
                  <button onClick={changeRole} className="cursor-pointer px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                    List cars
                  </button>
                )}
                {!user ? (
                  <button onClick={()=> navigate('/login')} className="px-8 py-2 bg-[#7FFF00] hover:bg-[#6fdc00] transition-all text-black rounded-lg">Login</button>
                ) : (
                  <ProfileDropdown />
                )}
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
