import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function Users() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/admin/users'); setItems(data?.items||data||[])})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>
        <div className="overflow-x-auto rounded border bg-white">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Role</th></tr></thead>
            <tbody>
              {items.map((u)=> (
                <tr key={u.UserID||u._id} className="border-t"><td className="p-2">{u.FullName}</td><td className="p-2">{u.Email}</td><td className="p-2">{u.Role}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedLayout>
  )
}
