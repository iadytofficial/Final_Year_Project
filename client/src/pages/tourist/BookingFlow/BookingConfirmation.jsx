export default function BookingConfirmation({ booking }){
  if (!booking) return <div className="p-4">No booking found.</div>
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Booking Confirmed</p>
      <p>ID: {booking.BookingID||booking._id}</p>
      <p>Date: {new Date(booking.ActivityDate).toLocaleString()}</p>
      <p>Participants: {booking.NumberOfParticipants}</p>
      <p>Total: LKR {booking.TotalCost?.toLocaleString?.()||booking.TotalCost}</p>
    </div>
  )
}