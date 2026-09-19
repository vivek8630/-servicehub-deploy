'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  QrCode,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Tag,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface Service {
  id: string
  name: string
  price: number
  priceType: string
}

interface BookingFormWrapperProps {
  providerId: string
  services: Service[]
}

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
]

export default function BookingFormWrapper({ providerId, services }: BookingFormWrapperProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(services[0] || null)

  // Booking details
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  // Promo code
  const [promoCode, setPromoCode] = useState('')
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; value: number } | null>(null)
  const [promoError, setPromoError] = useState('')

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')

  // Flow states
  const [loading, setLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Securing booking channel...')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const today = new Date().toISOString().split('T')[0]

  // Dynamic pricing calculations
  const basePrice = selectedService?.price || 0
  const gstTax = Math.round(basePrice * 0.18) // 18% GST
  const platformFee = 99 // ₹99 Fixed fee
  
  let discountAmount = 0
  if (activeDiscount) {
    const promo = PROMO_CODES[activeDiscount.code]
    if (promo?.percent) {
      discountAmount = Math.round(basePrice * (promo.percent / 100))
    } else if (promo?.flat) {
      discountAmount = Math.min(basePrice, promo.flat)
    }
  }
  const grandTotal = Math.max(0, basePrice + gstTax + platformFee - discountAmount)

  // Apply Coupon Code
  const handleApplyPromo = async () => {
    setPromoError('')
    const code = promoCode.toUpperCase().trim()
    if (!code) {
      setPromoError('Please enter a coupon code.')
      return
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (res.ok) {
        setActiveDiscount({ code, value: data.discount })
        setPromoError('')
      } else {
        setPromoError(data.error || 'Invalid coupon code.')
        setActiveDiscount(null)
      }
    } catch (e) {
      setPromoError('Could not validate coupon.')
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !selectedService) {
      setError('Please select a service first.')
      return
    }
    if (step === 2 && (!date || !time)) {
      setError('Please select a date and time slot.')
      return
    }
    if (step === 3 && !address.trim()) {
      setError('Please enter a service address.')
      return
    }
    setError('')
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setError('')
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handlePayAndBook = async () => {
    // Basic verification
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        setError('Please enter your card payment details.')
        return
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g., user@upi).')
        return
      }
    }

    setError('')
    setLoading(true)

    // Simulate animated secure checkout loaders
    let messages = []
    if (paymentMethod === 'cash') {
      messages = ['Processing booking request...', 'Registering slot and notifying provider...']
    } else {
      messages = [
        'Establishing secure token connection...',
        'Authorizing payment gateway...',
        'Deducting transaction amount securely...',
        'Registering slot and notifying provider profile...',
      ]
    }

    for (let i = 0; i < messages.length; i++) {
      setLoaderMessage(messages[i])
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          serviceId: selectedService?.id,
          scheduledDate: date,
          scheduledTime: time,
          address,
          notes,
          estimatedPrice: grandTotal,
          paymentMethod,
        }),
      })

      if (res.ok) {
        // Generate random dynamic Booking Reference
        const rand = Math.floor(100000 + Math.random() * 900000)
        setBookingRef(`SHB-${rand}-IND`)
        setSuccess(true)
        setStep(5)
        // Dispatch event to update navbar/profile lists
        window.dispatchEvent(new Event('notificationsUpdated'))
      } else {
        const data = await res.json()
        setError(data.error || 'Payment was processed but booking registration failed.')
      }
    } catch {
      setError('Connection failure. Payment could not be validated.')
    } finally {
      setLoading(false)
    }
  }

  // STEP 5: Success view
  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-150 p-6 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce mt-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
          <p className="text-xs text-slate-500 mt-1">Your payment was secured and request was dispatched.</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Reference ID:</span>
            <span className="font-mono font-bold text-slate-800">{bookingRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Service:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[150px]">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scheduled:</span>
            <span className="font-medium text-slate-800">{date} at {time}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm">
            <span className="text-slate-700">Amount:</span>
            <span className="text-violet-600">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment:</span>
            <span className="font-semibold text-slate-800">
              {paymentMethod === 'cash' ? 'Pay Later / Cash' : paymentMethod === 'upi' ? 'UPI' : 'Card'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className={`font-semibold ${paymentMethod === 'cash' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {paymentMethod === 'cash' ? 'Pending' : 'Paid'}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="gradient" className="w-full rounded-xl" onClick={() => router.push('/bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Step {step} of 4</span>
        <span className="text-xs text-slate-500">
          {step === 1 && 'Estimate Charges'}
          {step === 2 && 'Choose Date & Time'}
          {step === 3 && 'Service Address'}
          {step === 4 && 'Complete Checkout'}
        </span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-3.5 py-2.5 text-xs flex items-start gap-1.5 animate-headShake">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select Service & Pricing breakdown */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Choose Service Option</label>
            <select
              value={selectedService?.id}
              onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value) || null)}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 bg-white"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</option>
              ))}
            </select>
          </div>

          {/* Promo code area */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Promo Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="E.g. AC10, CLEAN20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 uppercase"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo} className="rounded-xl font-semibold">
                Apply
              </Button>
            </div>
            {promoError && <p className="text-[10px] text-red-500 mt-1 font-semibold">{promoError}</p>}
            {activeDiscount && (
              <p className="text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> Coupon "{activeDiscount.code}" applied!
              </p>
            )}
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-1.5 mb-2">Pricing Details</h4>
            <div className="flex justify-between">
              <span>Base Labor Charges:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (18%):</span>
              <span className="font-semibold text-slate-800">{formatCurrency(gstTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Safety & Platform Fee:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(platformFee)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-650 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                <span>Discount Applied:</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
              <span>Total Estimated:</span>
              <span className="text-violet-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button variant="gradient" className="w-full rounded-xl gap-1" onClick={handleNextStep}>
            Proceed to Schedule <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* STEP 2: Date & Time Scheduler */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> Choose Date
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Select Time Slot
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`text-xs py-2 rounded-xl border transition-all ${
                    time === slot
                      ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold shadow-sm'
                      : 'border-slate-150 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl gap-1" onClick={handlePrevStep}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="button" variant="gradient" className="flex-1 rounded-xl gap-1" onClick={handleNextStep} disabled={!date || !time}>
              Next Step <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Address & Directions */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Service Location Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door/Flat number, Street, Landmark, City..."
              rows={3}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Booking Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Call before arrival, parking details, exact issue..."
              rows={2}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-slate-800"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl gap-1" onClick={handlePrevStep}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="button" variant="gradient" className="flex-1 rounded-xl gap-1" onClick={handleNextStep} disabled={!address.trim()}>
              Checkout <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Mock UPI/Card Checkout Gateway */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Booking recap */}
          <div className="bg-violet-50 rounded-2xl p-3 border border-violet-100 text-xs text-violet-750 flex items-center justify-between">
            <div>
              <p className="font-semibold">Schedule Confirmed</p>
              <p className="text-[10px] mt-0.5">{date} at {time}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Total Payable</p>
              <p className="font-bold text-sm text-violet-700">{formatCurrency(grandTotal)}</p>
            </div>
          </div>

          {/* Payment selector tabs */}
          <div className="grid grid-cols-3 gap-2 border border-slate-100 p-1 rounded-xl bg-slate-50">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                paymentMethod === 'upi' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" /> UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                paymentMethod === 'card' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-lg transition-all ${
                paymentMethod === 'cash' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Pay Later
            </button>
          </div>

          {/* Payment Fields */}
          {paymentMethod === 'upi' ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Your UPI Handle</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@ybl, name@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                A verification notification request will be pushed directly to your UPI mobile app.
              </p>
            </div>
          ) : paymentMethod === 'card' ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">CVV Code</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 bg-white text-center font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                <FileText className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-amber-800 text-sm mb-1">Payment will be collected after the service.</p>
                <p className="text-xs text-amber-700">You can pay via cash, UPI, or card directly to the provider once the job is completed.</p>
              </div>
            </div>
          )}

          {/* Secure gateway note */}
          <div className="flex gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl items-center text-[10px] text-slate-400">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wide px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-100 shrink-0">SSL Secure</span>
            Payments are 256-bit encrypted. This is a sandbox testing mockup environment.
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl gap-1"
              onClick={handlePrevStep}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              type="button"
              variant="gradient"
              className="flex-1 rounded-xl gap-1.5"
              onClick={handlePayAndBook}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(grandTotal)}`
              )}
            </Button>
          </div>

          {/* Animated loading step messaging overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
              <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
              <div className="text-center space-y-1 animate-pulse">
                <h4 className="font-bold text-slate-800 text-sm">Processing Secure Transaction</h4>
                <p className="text-xs text-slate-500 font-medium">{loaderMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
