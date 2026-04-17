import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import BackButton from '../components/BackButton'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const Payment = () => {
  const { axios, currency, cars, user } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { carId, pickupDate, returnDate, location: bookingLocation, documents } = location.state || {}

  const [car, setCar] = useState(null)
  const [locationValue, setLocationValue] = useState(bookingLocation || '')
  const [price, setPrice] = useState(0)
  const [processing, setProcessing] = useState(false)
  const MAX_PAYMENT_AMOUNT = 500000 // ₹5 lakh max per transaction

  useEffect(() => {
    if (!carId || !pickupDate || !returnDate) {
      navigate('/')
      return
    }
    const foundCar = cars.find(c => c._id === carId)
    if (foundCar) {
      setCar(foundCar)
      const picked = new Date(pickupDate)
      const returned = new Date(returnDate)
      const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
      setPrice(foundCar.pricePerDay * noOfDays)
    }
  }, [carId, pickupDate, returnDate, cars, navigate])

  const handlePayment = async () => {
    try {
      if (!price || price <= 0) {
        toast.error('Invalid price. Please try again.')
        return
      }

      // Validate amount is within limits
      if (price > MAX_PAYMENT_AMOUNT) {
        toast.error(`Payment amount cannot exceed ₹${MAX_PAYMENT_AMOUNT.toLocaleString()}. Please contact support.`)
        return
      }

      // Ensure amount is an integer
      const intAmount = Math.round(price)
      if (intAmount !== price) {
        console.warn(`Price adjusted from ${price} to ${intAmount}`)
      }

      setProcessing(true)
      
      // Step 1: Create Razorpay Order
      console.log('🔵 Sending order request:', { amount: intAmount, carId, pickupDate, returnDate })
      
      const { data: orderData } = await axios.post('/api/payment/create-order', {
        amount: intAmount,
        carId,
        pickupDate,
        returnDate
      })

      console.log('📦 Order response:', orderData)

      if (!orderData.success) {
        let errorMsg = orderData.message || 'Failed to create order'
        
        // Show test mode limit warning more clearly
        if (orderData.testModeLimit) {
          errorMsg = `🚨 Test Mode Limit Exceeded!\n\nMax allowed: ₹${orderData.testModeLimit.toLocaleString()}\nRequested: ₹${orderData.requestedAmount.toLocaleString()}\n\nPlease reduce the booking amount.`
        }
        
        toast.error(errorMsg)
        setProcessing(false)
        return
      }

      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Rento - Car Rental',
        description: `Booking for ${car.brand} ${car.model}`,
        order_id: orderData.order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#7FFF00'
        },
        handler: async function (response) {
          try {
            // Step 3: Verify Payment
            const { data: verifyData } = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              carId,
              pickupDate,
              returnDate,
              documents
            })

            if (verifyData.success) {
              toast.success(' Payment Successful! Booking Confirmed')
              navigate('/my-bookings')
            } else {
              toast.error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            toast.error(error.response?.data?.message || 'Payment verification failed')
          } finally {
            setProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || error.message || 'Payment failed')
      setProcessing(false)
    }
  }

  if (!car) return <Loader />

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-16'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <BackButton />
        </div>
        <h1 className='text-3xl font-bold text-center mb-8'>Complete Your Payment</h1>

        {/* Booking Summary */}
        <div className='bg-white shadow-lg rounded-xl p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Booking Summary</h2>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span>Car:</span>
              <span className='font-medium'>{car.brand} {car.model}</span>
            </div>
            <div className='flex justify-between'>
              <span>Location:</span>
              <span>{locationValue || car.location}</span>
            </div>
            <div className='flex justify-between'>
              <span>Pickup Date:</span>
              <span>{new Date(pickupDate).toLocaleDateString()}</span>
            </div>
            <div className='flex justify-between'>
              <span>Return Date:</span>
              <span>{new Date(returnDate).toLocaleDateString()}</span>
            </div>
            <div className='flex justify-between'>
              <span>Price per Day:</span>
              <span>{currency}{car.pricePerDay}</span>
            </div>
            <div className='border-t pt-3 flex justify-between text-lg font-semibold'>
              <span>Total Amount:</span>
              <span className='text-[#7FFF00]'>{currency}{price}</span>
            </div>
          </div>
        </div>

        {/* Test Mode Warning */}
        {price > 50000 && (
          <div className='bg-red-50 border border-red-300 rounded-xl p-4 mb-6'>
            <p className='text-red-800 font-semibold'> Test Mode Limit</p>
            <p className='text-red-700 text-sm mt-2'>
              Your booking amount (₹{price.toLocaleString()}) exceeds the test mode limit of ₹50,000. 
              Payment may fail. Please reduce your booking duration or contact support.
            </p>
          </div>
        )}

        {/* Payment Info */}
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6'>
          <h2 className='text-lg font-semibold mb-3 flex items-center'>
            <span className='text-blue-600 mr-2'>ℹ️</span>
            Safe & Secure Payment
          </h2>
          <ul className='space-y-2 text-sm text-gray-700'>
            <li className='flex items-start'>
              <span className='text-[#7FFF00] mr-2'>✓</span>
              <span>Powered by <strong>Razorpay</strong> - India's most trusted payment gateway</span>
            </li>
            <li className='flex items-start'>
              <span className='text-[#7FFF00] mr-2'>✓</span>
              <span>100% secure transactions with SSL encryption</span>
            </li>
            <li className='flex items-start'>
              <span className='text-[#7FFF00] mr-2'>✓</span>
              <span>Your payment information is never stored on our servers</span>
            </li>
          </ul>
        </div>

        {/* Proceed Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className='w-full bg-[#7FFF00] hover:bg-[#6fdc00] disabled:opacity-50 disabled:cursor-not-allowed transition-all py-4 font-bold text-black rounded-full text-lg cursor-pointer'
        >
          {processing ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2'></div>
              Processing...
            </div>
          ) : (
            '💳 Proceed to Payment'
          )}
        </button>

        {/* Cancellation Notice */}
        <p className='text-center text-gray-600 text-sm mt-4'>
          You can cancel anytime. Your payment is secure and verified.
        </p>
      </div>
    </div>
  )
}

export default Payment