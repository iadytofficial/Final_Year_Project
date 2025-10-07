import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="py-24"><LoadingSpinner /></div>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && roles.length > 0 && !roles.includes(user?.Role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
