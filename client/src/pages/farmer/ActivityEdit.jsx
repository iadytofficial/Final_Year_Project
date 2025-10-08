import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'
import AvailabilityEditor from '../../components/availability/AvailabilityEditor'
import ImagesManager from '../images/ImagesManager'
import ImageUploadWithAlt from '../../components/common/ImageUploadWithAlt'

export default function ActivityEdit() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  useEffect(()=>{(async()=>{const {data}=await api.get(`/activities/${id}`); setActivity(data); setTitle(data.CustomTitle); setPrice(data.PricePerPerson)})()},[id])

  const save = async () => {
    try {
      await api.put(`/activities/${id}`, { CustomTitle: title, PricePerPerson: Number(price) })
      toast.success('Saved')
    } catch (e) { toast.error('Failed to save') }
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Edit Activity</h1>
        {!activity ? <p>Loading...</p> : (
          <div className="space-y-4">
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded border px-3 py-2" />
            <input type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full rounded border px-3 py-2" />
            <button onClick={save} className="rounded bg-brand px-4 py-2 text-white">Save</button>
            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-2">Availability</h2>
              <AvailabilityEditor entityType="Activity" entityId={id} />
            </div>
            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-2">Images</h2>
              <div className="mb-3">
                <ImageUploadWithAlt entityType="Activity" entityId={id} uploadPath={`/activities/${id}/upload-images`} />
              </div>
              <ImagesManager entityType="Activity" entityId={id} />
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
