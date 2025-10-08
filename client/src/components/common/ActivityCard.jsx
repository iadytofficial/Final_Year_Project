import { Link } from 'react-router-dom'
import RatingStars from './RatingStars'
import Price from './Price'

export default function ActivityCard({ activity }) {
  return (
    <Link to={`/experience/${activity.ActivityID || activity._id || ''}`} className="block overflow-hidden rounded border bg-white hover:shadow">
      <img src={activity.Images?.[0]} alt={activity.CustomTitle} className="h-40 w-full object-cover" />
      <div className="p-3">
        <h3 className="truncate font-medium">{activity.CustomTitle}</h3>
        <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
          <RatingStars value={activity.Rating || 0} />
          <span className="font-semibold text-brand"><Price amountLkr={activity.PricePerPerson} /></span>
        </div>
      </div>
    </Link>
  )
}
