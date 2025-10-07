import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function EmailVerification() {
  const { token } = useParams()
  const [state, setState] = useState('verifying')

  useEffect(() => {
    async function verify() {
      try {
        await api.post(`/auth/verify-email/${token}`)
        setState('success')
      } catch {
        setState('error')
      }
    }
    verify()
  }, [token])

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      {state === 'verifying' && <p>Verifying...</p>}
      {state === 'success' && (
        <div>
          <h1 className="text-2xl font-semibold">Email verified</h1>
          <p className="mt-2">You can now <Link to="/login" className="text-brand">login</Link>.</p>
        </div>
      )}
      {state === 'error' && <p className="text-red-600">Verification failed or token expired.</p>}
    </div>
  )
}
