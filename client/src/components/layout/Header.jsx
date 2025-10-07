import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../common/NotificationBell'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand">AgroLK</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/search" className="hover:text-brand">Search</Link>
          <Link to="/experiences" className="hover:text-brand">Experiences</Link>
          <Link to="/destinations" className="hover:text-brand">Destinations</Link>
          {user && <Link to="/notifications" className="hover:text-brand"><NotificationBell /></Link>}
          {user ? (
            <>
              {user.Role === 'Tourist' && <Link to="/dashboard" className="hover:text-brand">Dashboard</Link>}
              {user.Role === 'Farmer' && <Link to="/farmer/dashboard" className="hover:text-brand">Farmer</Link>}
              {user.Role === 'TourGuide' && <Link to="/guide/dashboard" className="hover:text-brand">Guide</Link>}
              {user.Role === 'TransportProvider' && <Link to="/transport/dashboard" className="hover:text-brand">Transport</Link>}
              {user.Role === 'Administrator' && <Link to="/admin" className="hover:text-brand">Admin</Link>}
              <button onClick={logout} className="rounded bg-brand px-3 py-1.5 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand">Login</Link>
              <Link to="/register" className="rounded bg-brand px-3 py-1.5 text-white">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
