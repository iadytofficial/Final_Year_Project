import PublicLayout from '../public/PublicLayout'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Contact(){
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (v)=>{ try{ await api.post('/support/contact', v); toast.success('Message sent'); reset() } catch { toast.error('Failed to send') } }
  return(
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('name',{required:true})} placeholder="Your name" className="w-full rounded border px-3 py-2" />
          <input {...register('email',{required:true})} type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
          <input {...register('subject',{required:true})} placeholder="Subject" className="w-full rounded border px-3 py-2" />
          <textarea {...register('message',{required:true})} rows={5} placeholder="Message" className="w-full rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Send</button>
        </form>
      </div>
    </PublicLayout>
  )
}