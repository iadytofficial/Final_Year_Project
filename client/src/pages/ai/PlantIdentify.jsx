import { useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

export default function PlantIdentify(){
  const [file,setFile]=useState(null)
  const [result,setResult]=useState(null)
  const onSelect = (e)=> setFile(e.target.files?.[0]||null)
  const submit = async ()=>{
    if(!file) return
    const reader = new FileReader()
    reader.onload = async ()=>{
      const base64 = reader.result.split(',')[1]
      const { data } = await api.post('/ai/identify-plant',{ image: base64 })
      setResult(data)
    }
    reader.readAsDataURL(file)
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Identify Plant</h1>
        <input type="file" accept="image/*" onChange={onSelect} />
        <button onClick={submit} className="ml-2 rounded bg-brand px-3 py-1.5 text-white">Identify</button>
        {result && (
          <div className="mt-4 rounded border bg-white p-4 text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(result,null,2)}</pre>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}