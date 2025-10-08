import { useForm } from 'react-hook-form'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function ActivityCreation() {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (values) => {
    try {
      await api.post('/activities/create', {
        CustomTitle: values.CustomTitle,
        PricePerPerson: Number(values.PricePerPerson || 0),
        Status: 'Active',
      })
      toast.success('Activity created')
      reset()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create activity')
    }
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Create Activity</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('CustomTitle', { required: true })} placeholder="Title" className="w-full rounded border px-3 py-2" />
          <input type="number" step="0.01" {...register('PricePerPerson', { required: true })} placeholder="Price per person" className="w-full rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Create</button>
        </form>
      </div>
    </ProtectedLayout>
  )
}
