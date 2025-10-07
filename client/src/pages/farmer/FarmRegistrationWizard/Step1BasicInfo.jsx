import { useForm } from 'react-hook-form'

export default function Step1BasicInfo({ defaultValues, onSubmit }) {
  const { register, handleSubmit } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Farm Name</label>
        <input {...register('FarmName', { required: true })} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Farm Type</label>
        <input {...register('FarmType')} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register('Description')} rows={5} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
    </form>
  )
}
