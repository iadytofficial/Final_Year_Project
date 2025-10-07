import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import api from '../../../services/api'
import { useCallback, useMemo, useState } from 'react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function PaymentInner({ bookingData, onSuccess }){
  const stripe = useStripe()
  const elements = useElements()
  const [loading,setLoading]=useState(false)
  const total = useMemo(()=> bookingData?.TotalCost || 0, [bookingData])

  const pay = useCallback(async ()=>{
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const intent = await api.post('/payments/create-intent', { amount: Math.round(total*100), currency: 'lkr' })
      const card = elements.getElement(CardElement)
      const { error, paymentIntent } = await stripe.confirmCardPayment(intent.data.clientSecret, {
        payment_method: { card },
      })
      if (error) throw error
      await api.post('/payments/confirm', { paymentIntentId: paymentIntent.id, bookingId: bookingData.bookingId })
      onSuccess?.(paymentIntent)
    } finally { setLoading(false) }
  }, [stripe, elements, total, bookingData, onSuccess])

  return (
    <div className="space-y-4">
      <div className="rounded border bg-white p-4">
        <p className="text-sm">Total: <span className="font-semibold">LKR {total.toLocaleString?.()||total}</span></p>
        <div className="mt-3 rounded border p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <button onClick={pay} disabled={!stripe||loading} className="mt-3 rounded bg-brand px-4 py-2 text-white disabled:opacity-50">Pay</button>
      </div>
    </div>
  )
}

export default function PaymentForm({ bookingData, onSuccess }){
  return (
    <Elements stripe={stripePromise}>
      <PaymentInner bookingData={bookingData} onSuccess={onSuccess} />
    </Elements>
  )
}
