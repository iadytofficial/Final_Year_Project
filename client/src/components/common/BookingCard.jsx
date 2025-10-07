import { Link } from 'react-router-dom'

export default function BookingCard({ booking }) {
  return (
    <div className="rounded border bg-white p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{booking.ActivityTitle || 'Activity'}</h3>
          <p className="text-sm text-gray-600">{new Date(booking.ActivityDate).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">Participants: {booking.NumberOfParticipants}</p>
          <p className="font-semibold">LKR {booking.TotalCost?.toLocaleString?.() || booking.TotalCost}</p>
        </div>
      </div>
      <div className="mt-3 text-right">
        <Link to={`/bookings/${booking.BookingID || booking._id}`} className="rounded border px-3 py-1 text-sm">View</Link>
      </div>
    </div>
  )
}
