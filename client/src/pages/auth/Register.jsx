import { useForm } from 'react-hook-form'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Register() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (values) => {
    try {
      await api.post('/auth/register', {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        role: values.role,
      })
      toast.success('Registered! Check your email to verify.')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('fullName', { required: true })} placeholder="Full name" className="w-full rounded border px-3 py-2" />
        <input {...register('email', { required: true })} type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input {...register('phoneNumber', { required: true })} placeholder="Phone number" className="w-full rounded border px-3 py-2" />
        <select {...register('role', { required: true })} className="w-full rounded border px-3 py-2">
          <option value="Tourist">Tourist</option>
          <option value="Farmer">Farmer</option>
          <option value="TourGuide">Tour Guide</option>
          <option value="TransportProvider">Transport Provider</option>
        </select>
        <input {...register('password', { required: true })} type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-brand px-3 py-2 text-white">Create account</button>
      </form>
    </div>
  )
}
