import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useState } from 'react'

export default function Payouts() {
  const [processing, setProcessing] = useState(false)
  const process = async () => { setProcessing(true); try{ await api.post('/admin/payouts/process'); } finally { setProcessing(false) } }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Payouts</h1>
        <button onClick={process} disabled={processing} className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50">{processing? 'Processing…' : 'Process Payouts'}</button>
      </div>
    </ProtectedLayout>
  )
}
