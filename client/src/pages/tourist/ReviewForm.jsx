import { useForm } from 'react-hook-form'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function ReviewForm(){
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (v)=>{
    try{ await api.post('/reviews/create',{ BookingID: v.BookingID, Rating: Number(v.Rating), Comment: v.Comment })
      toast.success('Review submitted for moderation'); reset() }catch{ toast.error('Failed') }
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Write a Review</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('BookingID',{required:true})} placeholder="Booking ID" className="w-full rounded border px-3 py-2" />
          <select {...register('Rating',{required:true})} className="w-full rounded border px-3 py-2">
            <option value="">Rating</option>
            {[1,2,3,4,5].map((n)=><option key={n} value={n}>{n}</option>)}
          </select>
          <textarea {...register('Comment')} rows={5} placeholder="Comment (max 500 chars)" className="w-full rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Submit</button>
        </form>
      </div>
    </ProtectedLayout>
  )
}