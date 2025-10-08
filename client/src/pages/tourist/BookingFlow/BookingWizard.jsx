import { useState } from 'react'
import ProtectedLayout from '../../../components/common/ProtectedLayout'
import StepProgressBar from '../../../components/common/StepProgressBar'
import SelectDateTime from './SelectDateTime'
import PaymentForm from './PaymentForm'
import SelectExtras from './SelectExtras'
import PersonalDetails from './PersonalDetails'
import BookingConfirmation from './BookingConfirmation'
import api from '../../../services/api'

const steps = ['Date & Time', 'Extras', 'Details', 'Payment', 'Confirmation']

export default function BookingWizard() {
  const [current, setCurrent] = useState(0)
  const [data, setData] = useState({})

  const next = () => setCurrent((c) => Math.min(c + 1, steps.length - 1))
  const prev = () => setCurrent((c) => Math.max(c - 1, 0))
  const createBooking = async () => {
    const payload = {
      ActivityID: data.activityId,
      ActivityDate: data.step1?.date,
      NumberOfParticipants: data.step2?.participants || 1,
      Options: { guide: data.step2?.guide, transport: data.step2?.transport },
      SpecialRequests: data.details?.SpecialRequests,
    }
    const { data: res } = await api.post('/bookings/create', payload)
    setData((d)=> ({ ...d, bookingId: res.BookingID||res._id, totalCost: res.TotalCost, booking: res }))
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <StepProgressBar steps={steps} current={current} />
        <div className="mt-6 rounded border bg-white p-4">
          {current === 0 && (
            <SelectDateTime activityId={data.activityId} value={data.step1} onChange={(v) => setData((d) => ({ ...d, step1: v }))} />
          )}
          {current === 1 && (
            <SelectExtras activityId={data.activityId} value={data.step2} onChange={(v)=> setData((d)=> ({ ...d, step2: v }))} />
          )}
          {current === 2 && (
            <PersonalDetails value={data.details} onSubmit={async (v)=>{ setData((d)=> ({ ...d, details: v })); await createBooking(); setCurrent(3) }} />
          )}
          {current === 3 && (
            <PaymentForm bookingData={{ TotalCost: data.totalCost||0, bookingId: data.bookingId }} onSuccess={()=> setCurrent(4)} />
          )}
          {current === 4 && (
            <BookingConfirmation booking={data.booking} />
          )}
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={prev} disabled={current===0} className="rounded border px-4 py-2 disabled:opacity-50">Back</button>
          <button onClick={next} className="rounded bg-brand px-4 py-2 text-white">Next</button>
        </div>
      </div>
    </ProtectedLayout>
  )}
