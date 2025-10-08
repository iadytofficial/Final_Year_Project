import { useForm } from 'react-hook-form'
import ProtectedLayout from '../../../components/common/ProtectedLayout'
import api from '../../../services/api'
import { toast } from 'react-toastify'

export default function GuideRegistration(){
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (v)=>{
    try{ await api.post('/guides/register',{ LicenseNumber: v.LicenseNumber, NIC: v.NIC, YearsOfExperience: Number(v.YearsOfExperience||0), LanguageSpoken: (v.LanguageSpoken||'').split(',').map(s=>s.trim()).filter(Boolean) }); toast.success('Guide profile submitted for verification'); reset() }catch{ toast.error('Failed') }
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Guide Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('LicenseNumber',{required:true})} placeholder="License Number" className="w-full rounded border px-3 py-2" />
          <input {...register('NIC',{required:true})} placeholder="NIC" className="w-full rounded border px-3 py-2" />
          <input {...register('YearsOfExperience')} type="number" placeholder="Years of Experience" className="w-full rounded border px-3 py-2" />
          <input {...register('LanguageSpoken')} placeholder="Languages (comma-separated)" className="w-full rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Submit</button>
        </form>
      </div>
    </ProtectedLayout>
  )
}