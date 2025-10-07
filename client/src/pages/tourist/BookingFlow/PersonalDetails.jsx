import { useForm } from 'react-hook-form'

export default function PersonalDetails({ value, onSubmit }){
  const { register, handleSubmit } = useForm({ defaultValues: value })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register('FullName',{required:true})} placeholder="Full name" className="w-full rounded border px-3 py-2" />
      <input {...register('Email',{required:true})} type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input {...register('PhoneNumber',{required:true})} placeholder="Phone number" className="w-full rounded border px-3 py-2" />
      <textarea {...register('SpecialRequests')} rows={4} placeholder="Special requests" className="w-full rounded border px-3 py-2" />
      <button className="rounded bg-brand px-4 py-2 text-white">Continue</button>
    </form>
  )
}