import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function Saved(){
  const [items,setItems]=useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/search/saved'); setItems(data?.items||[])})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Saved Searches</h1>
        <ul className="list-disc pl-6 text-sm">
          {items.map((s,i)=>(<li key={i}>{JSON.stringify(s)}</li>))}
        </ul>
      </div>
    </ProtectedLayout>
  )
}