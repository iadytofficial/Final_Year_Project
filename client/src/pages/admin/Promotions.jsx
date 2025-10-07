import ProtectedLayout from '../../components/common/ProtectedLayout'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Promotions(){
  const [items,setItems]=useState([])
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/admin/promotions'); setItems(data?.items||[])}catch{}})()},[])
  const add = async (e)=>{ e.preventDefault(); const form = new FormData(e.currentTarget); const payload = Object.fromEntries(form.entries()); payload.Value = Number(payload.Value||0); await api.post('/admin/promotions', payload); toast.success('Promotion created') }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Promotions</h1>
        <form onSubmit={add} className="mb-4 grid grid-cols-2 gap-2">
          <input name="Code" placeholder="Code" className="rounded border px-3 py-2" />
          <select name="Type" className="rounded border px-3 py-2"><option>Percentage</option><option>Fixed</option></select>
          <input name="Value" type="number" step="0.01" placeholder="Value" className="rounded border px-3 py-2" />
          <input name="ValidFrom" type="date" className="rounded border px-3 py-2" />
          <input name="ValidTo" type="date" className="rounded border px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-white">Create</button>
        </form>
        <div className="rounded border bg-white">
          <table className="min-w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-2 text-left">Code</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Value</th></tr></thead>
          <tbody>{items.map(p=>(<tr key={p.PromotionID||p._id} className="border-t"><td className="p-2">{p.Code}</td><td className="p-2">{p.Type}</td><td className="p-2">{p.Value}</td></tr>))}</tbody></table>
        </div>
      </div>
    </ProtectedLayout>
  )
}