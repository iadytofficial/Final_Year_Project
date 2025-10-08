import { useForm } from 'react-hook-form'

export default function Step2FarmDetails({ defaultValues, onSubmit }) {
  const { register, handleSubmit } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Address</label>
        <input {...register('Location.address', { required: true })} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input type="number" step="any" {...register('Location.coordinates.lat')} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input type="number" step="any" {...register('Location.coordinates.lng')} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Facilities (comma separated)</label>
        <input {...register('FacilitiesCsv')} placeholder="WiFi, Parking, Restroom" className="mt-1 w-full rounded border px-3 py-2" />
      </div>
    </form>
  )
}
