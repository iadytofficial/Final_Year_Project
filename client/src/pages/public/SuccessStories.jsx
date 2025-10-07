import PublicLayout from './PublicLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function SuccessStories(){
  const [items,setItems]=useState([])
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/public/success-stories'); setItems(data?.items||[])}catch{}})()},[])
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Success Stories</h1>
        <div className="space-y-3">
          {items.map((s,i)=> (
            <div key={i} className="rounded border bg-white p-4">
              <h3 className="font-medium">{s.title||'Story'}</h3>
              <p className="text-sm text-gray-700 mt-1">{s.body||s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}