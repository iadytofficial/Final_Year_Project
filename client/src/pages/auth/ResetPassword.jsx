import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch } = useForm()

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword: password })
      toast.success('Password reset, please login')
      navigate('/login')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('password', { required: true })} type="password" placeholder="New password" className="w-full rounded border px-3 py-2" />
        <input {...register('confirmPassword', { required: true })} type="password" placeholder="Confirm password" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-brand px-3 py-2 text-white">Reset password</button>
      </form>
    </div>
  )
}
