import { useForm } from 'react-hook-form'
import ProtectedLayout from '../../../components/common/ProtectedLayout'
import api from '../../../services/api'
import { toast } from 'react-toastify'

export default function TransportRegistration(){
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (v)=>{
    try{ await api.post('/transport/register',{ VehicleType: v.VehicleType, VehicleRegistrationNo: v.VehicleRegistrationNo, MaxPassengers: Number(v.MaxPassengers||0), PricePerKm: Number(v.PricePerKm||0) }); toast.success('Transport profile submitted for verification'); reset() }catch{ toast.error('Failed') }
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Transport Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('VehicleType',{required:true})} placeholder="Vehicle Type" className="w-full rounded border px-3 py-2" />
          <input {...register('VehicleRegistrationNo',{required:true})} placeholder="Vehicle Registration No" className="w-full rounded border px-3 py-2" />
          <input {...register('MaxPassengers')} type="number" placeholder="Max Passengers" className="w-full rounded border px-3 py-2" />
          <input {...register('PricePerKm')} type="number" step="0.01" placeholder="Price per Km" className="w-full rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Submit</button>
        </form>
      </div>
    </ProtectedLayout>
  )
}