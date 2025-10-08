import { useState } from 'react'
import api from '../../services/api'

export default function ImageUploadWithAlt({ entityType, entityId, uploadPath }){
  const [files,setFiles]=useState([])
  const [alts,setAlts]=useState({})
  const onSelect = (e)=> setFiles(Array.from(e.target.files||[]))
  const onAltChange = (idx, value)=> setAlts((a)=> ({ ...a, [idx]: value }))
  const upload = async ()=>{
    const form = new FormData()
    for (let i=0;i<files.length;i++){
      form.append('images', files[i])
    }
    await api.post(uploadPath, form)
  }
  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" multiple onChange={onSelect} />
      {files.map((f,idx)=>(
        <div key={idx} className="flex items-center gap-2 text-sm"><span className="truncate">{f.name}</span><input value={alts[idx]||''} onChange={(e)=>onAltChange(idx,e.target.value)} placeholder="Alt text" className="rounded border px-2 py-1" /></div>
      ))}
      <button onClick={upload} className="rounded border px-3 py-1">Upload</button>
    </div>
  )
}
