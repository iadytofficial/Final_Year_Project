import { useEffect, useState } from 'react'
import api from '../../services/api'
import BookingCard from '../../components/common/BookingCard'
import { Link } from 'react-router-dom'
import ProtectedLayout from '../../components/common/ProtectedLayout'

export default function MyBookings() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function run() {
      const { data } = await api.get('/bookings/my-bookings')
      setItems(data?.items || data || [])
    }
    run()
  }, [])

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
        <div className="space-y-3">
          {items.map((b) => (
            <Link key={b.BookingID || b._id} to={`/bookings/${b.BookingID||b._id}`} className="block">
              <BookingCard booking={b} />
            </Link>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
