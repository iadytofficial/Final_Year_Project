import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const { login } = useAuth()

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password)
      toast.success('Logged in')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('email', { required: true })} type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input {...register('password', { required: true })} type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-brand px-3 py-2 text-white">Login</button>
      </form>
    </div>
  )
}
