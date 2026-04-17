import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { assets, cityList } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const {id} = useParams()

  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [locationValue, setLocationValue] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [nationality, setNationality] = useState('')
  const [selectedIdentityDoc, setSelectedIdentityDoc] = useState('')
  const [documents, setDocuments] = useState({
    aadhar: null,
    voterId: null,
    panCard: null,
    drivingLicense: null,
    passport: null,
    internationalDrivingLicense: null,
    visa: null
  })
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (!locationValue || !pickupDate || !returnDate) {
      toast.error('Please select location, pickup date, and return date')
      return
    }
    if (!agreeToTerms) {
      toast.error('Please agree to the Terms & Conditions')
      return
    }
    if (!nationality) {
      toast.error('Please select your nationality')
      return
    }

    // Validate documents
    if (nationality === 'indian') {
      if (!selectedIdentityDoc) {
        toast.error('Please select one identity document for Indian users')
        return
      }
      if (!documents[selectedIdentityDoc]) {
        toast.error(`Please upload your ${selectedIdentityDoc.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
      if (!documents.drivingLicense) {
        toast.error('Driving License is required for Indian users')
        return
      }
    } else if (nationality === 'international') {
      if (!selectedIdentityDoc) {
        toast.error('Please select one identity document for international users')
        return
      }
      if (selectedIdentityDoc === 'passport' && !documents.passport) {
        toast.error('Please upload your passport')
        return
      }
      if (selectedIdentityDoc === 'visa' && !documents.visa) {
        toast.error('Please upload your visa')
        return
      }
      if (selectedIdentityDoc === 'idp' && !documents.internationalDrivingLicense) {
        toast.error('Please upload your International Driving Permit')
        return
      }
      if (!documents.internationalDrivingLicense) {
        toast.error('International Driving License is required for international users')
        return
      }
    }

    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: locationValue,
        pickupDate,
        returnDate
      })

      if (!data.success) {
        toast.error(data.message || 'Unable to verify availability')
        return
      }

      const isAvailable = data.availableCars.some((availableCar) => availableCar._id === id)
      if (!isAvailable) {
        toast.error('Car is not available for selected location or dates')
        return
      }

      // Upload documents if nationality is selected
      let uploadedDocuments = []
      if (nationality) {
        const formData = new FormData()
        const uploadTypes = []

        if (selectedIdentityDoc && documents[selectedIdentityDoc]) {
          formData.append('documents', documents[selectedIdentityDoc])
          uploadTypes.push(selectedIdentityDoc)
        }
        if (nationality === 'indian' && documents.drivingLicense) {
          formData.append('documents', documents.drivingLicense)
          uploadTypes.push('drivingLicense')
        }
        if (nationality === 'international' && documents.internationalDrivingLicense) {
          formData.append('documents', documents.internationalDrivingLicense)
          uploadTypes.push('internationalDrivingLicense')
        }
        if (nationality === 'international' && selectedIdentityDoc === 'visa' && documents.visa) {
          formData.append('documents', documents.visa)
          uploadTypes.push('visa')
        }

        uploadTypes.forEach(type => {
          formData.append('documentTypes', type)
        })

        const uploadRes = await axios.post('/api/bookings/upload-documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (uploadRes.data.success) {
          uploadedDocuments = uploadRes.data.documents
        } else {
          toast.error('Failed to upload documents')
          return
        }
      }

      navigate('/payment', { state: { carId: id, pickupDate, returnDate, location: locationValue, documents: uploadedDocuments } })
    } catch (error) {
      toast.error(error.message || 'Unable to verify availability')
    }
  }

  useEffect(()=>{
    const foundCar = cars.find(car => car._id === id)
    setCar(foundCar)
    if (foundCar?.location) {
      setLocationValue(foundCar.location)
    }
  },[cars, id])

  useEffect(() => {
    setSelectedIdentityDoc('')
    setDocuments(prev => ({
      ...prev,
      aadhar: null,
      voterId: null,
      panCard: null,
      drivingLicense: null,
      passport: null,
      internationalDrivingLicense: null,
      visa: null
    }))
  }, [nationality])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all cars
       </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
              <motion.div className='space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.location},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                      <img src={icon} alt="" className='h-5 mb-2'/>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500'>{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Features</h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    {
                      ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item)=>(
                        <li key={item} className='flex items-center text-gray-500'>
                          <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>

              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

            <div className='flex flex-col gap-2'>
              <label htmlFor='location'>Pickup Location</label>
              <select
                id='location'
                value={locationValue}
                onChange={(e)=>setLocationValue(e.target.value)}
                className='border border-borderColor px-3 py-2 rounded-lg bg-white'
                required
              >
                <option value=''>Select location</option>
                {cityList.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='nationality'>Nationality</label>
              <select
                id='nationality'
                value={nationality}
                onChange={(e)=>setNationality(e.target.value)}
                className='border border-borderColor px-3 py-2 rounded-lg bg-white'
                required
              >
                <option value=''>Select nationality</option>
                <option value='indian'>Indian</option>
                <option value='international'>International</option>
              </select>
            </div>

            {nationality === 'indian' && (
              <div className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <label className='font-medium'>Select one identity document <span className='text-red-500'>*</span></label>
                  <select
                    id='indian-identity-doc'
                    value={selectedIdentityDoc}
                    onChange={(e) => setSelectedIdentityDoc(e.target.value)}
                    className='border border-borderColor px-3 py-2 rounded-lg bg-white'
                    required
                  >
                    <option value=''>Select document</option>
                    <option value='aadhar'>Aadhar Card</option>
                    <option value='voterId'>Voter ID</option>
                    <option value='panCard'>PAN Card</option>
                  </select>
                </div>

                {selectedIdentityDoc && (
                  <div className='flex flex-col gap-2'>
                    <label className='font-medium'>Upload {selectedIdentityDoc === 'aadhar' ? 'Aadhar Card' : selectedIdentityDoc === 'voterId' ? 'Voter ID' : 'PAN Card'} <span className='text-red-500'>*</span></label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => setDocuments({...documents, [selectedIdentityDoc]: e.target.files[0]})}
                      className='w-full border border-borderColor px-3 py-2 rounded-lg'
                      required
                    />
                  </div>
                )}

                <div className='flex flex-col gap-2'>
                  <label className='font-medium'>Driving License <span className='text-red-500'>*</span></label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => setDocuments({...documents, drivingLicense: e.target.files[0]})}
                    className='w-full border border-borderColor px-3 py-2 rounded-lg'
                    required
                  />
                </div>
              </div>
            )}

            {nationality === 'international' && (
              <div className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <label className='font-medium'>Select primary document <span className='text-red-500'>*</span></label>
                  <select
                    id='international-identity-doc'
                    value={selectedIdentityDoc}
                    onChange={(e) => setSelectedIdentityDoc(e.target.value)}
                    className='border border-borderColor px-3 py-2 rounded-lg bg-white'
                    required
                  >
                    <option value=''>Select document</option>
                    <option value='passport'>Passport</option>
                    <option value='visa'>Visa</option>
                  </select>
                </div>

                {selectedIdentityDoc && (
                  <div className='flex flex-col gap-2'>
                    <label className='font-medium'>Upload {selectedIdentityDoc === 'passport' ? 'Passport' : 'Visa'} {selectedIdentityDoc === 'passport' ? (<span className='text-red-500'>*</span>) : null}</label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => setDocuments({...documents, [selectedIdentityDoc]: e.target.files[0]})}
                      className='w-full border border-borderColor px-3 py-2 rounded-lg'
                      required={selectedIdentityDoc === 'passport'}
                    />
                  </div>
                )}

                <div className='flex flex-col gap-2'>
                  <label className='font-medium'>International Driving License <span className='text-red-500'>*</span></label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => setDocuments({...documents, internationalDrivingLicense: e.target.files[0]})}
                    className='w-full border border-borderColor px-3 py-2 rounded-lg'
                    required
                  />
                </div>

                <div className='text-sm text-gray-500'>Passport and International Driving License are mandatory for international users.</div>
              </div>
            )}

            <p className='text-sm text-gray-500'>Note: Uploaded documents will be verified at the time of car pickup. Please ensure they match the originals.</p>

            <div className='flex flex-col gap-2'>
              <label htmlFor="pickup-date">Pickup Date</label>
              <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="return-date">Return Date</label>
              <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date'/>
            </div>

            <div className='flex items-start gap-2'>
              <input
                type='checkbox'
                id='agree-terms'
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className='mt-1'
              />
              <label htmlFor='agree-terms' className='text-sm'>
                I agree to the <Link to='/terms' className='text-primary underline'>Terms & Conditions</Link>
              </label>
            </div>

            <button className='w-full bg-[#7FFF00] hover:bg-[#6fdc00] transition-all py-3 font-medium text-black rounded-lg cursor-pointer'>Book Now</button>

            <p className='text-center text-sm'>No credit card required to reserve</p>

          </motion.form>
       </div>

    </div>
  ) : <Loader />
}

export default CarDetails
