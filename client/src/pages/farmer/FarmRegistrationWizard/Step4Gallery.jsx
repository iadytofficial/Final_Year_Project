import ImageUploader from '../../../components/common/ImageUploader'
import { useState } from 'react'

export default function Step4Gallery({ defaultValues = [], onSubmit }) {
  const [images, setImages] = useState(defaultValues)
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(images)}} className="space-y-4">
      <ImageUploader multiple max={10} onChange={setImages} />
    </form>
  )
}
