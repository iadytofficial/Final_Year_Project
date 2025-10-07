import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import ActivityCard from '../../components/common/ActivityCard'
import PublicLayout from './PublicLayout'
import SearchBar from '../../components/common/SearchBar'

export default function SearchResults() {
  const [params] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        const { data } = await api.get('/search/activities', { params: Object.fromEntries(params.entries()) })
        setItems(data?.results || [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params])

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <SearchBar />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loading ? <p>Loading...</p> : items.map((a) => <ActivityCard key={a.ActivityID || a._id} activity={a} />)}
        </div>
      </div>
    </PublicLayout>
  )
}
