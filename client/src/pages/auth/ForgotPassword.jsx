import { useForm } from 'react-hook-form'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async ({ email }) => {
    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('Reset link sent if email exists')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to send reset email')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('email', { required: true })} type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-brand px-3 py-2 text-white">Send reset link</button>
      </form>
    </div>
  )
}
