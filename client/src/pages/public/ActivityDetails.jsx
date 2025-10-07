import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from './PublicLayout'
import RatingStars from '../../components/common/RatingStars'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import RatingBreakdown from '../../components/common/RatingBreakdown'

export default function ActivityDetails() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [fav, setFav] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    async function run() {
      const { data } = await api.get(`/activities/${id}`)
      setActivity(data)
      try { const { data: favs } = await api.get('/favorites/list'); setFav(!!favs.items?.find((f)=> (f.ActivityID||f._id)===id)) } catch {}
    }
    run()
  }, [id])

  if (!activity) return <PublicLayout><div className="p-6">Loading...</div></PublicLayout>

  const toggleFavorite = async () => {
    if (!user) return
    if (fav) {
      await api.delete('/favorites/remove', { data: { activityId: id } })
      setFav(false)
    } else {
      await api.post('/favorites/add', { activityId: id })
      setFav(true)
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <img src={activity.Images?.[0]} alt={activity.CustomTitle} className="w-full rounded object-cover" />
          <div>
            <h1 className="text-2xl font-semibold">{activity.CustomTitle}</h1>
            <div className="mt-2"><RatingStars value={activity.Rating || 0} /></div>
            <p className="mt-4 text-gray-700 whitespace-pre-line">{activity.CustomDescription}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-semibold text-brand">LKR {activity.PricePerPerson?.toLocaleString?.() || activity.PricePerPerson}</span>
              <Link to="/bookings/new" className="rounded bg-brand px-4 py-2 text-white">Book now</Link>
            </div>
            {user && (
              <button onClick={toggleFavorite} className="mt-3 rounded border px-3 py-1 text-sm">
                {fav ? '★ Remove Favorite' : '☆ Add to Favorites'}
              </button>
            )}
          </div>
        </div>
        <RatingBreakdown distribution={activity.RatingDistribution||{}} subratings={activity.SubRatings||{}} />
      </div>
    </PublicLayout>
  )
}
