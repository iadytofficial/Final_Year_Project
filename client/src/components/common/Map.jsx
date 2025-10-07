import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

export default function Map({ center, markers = [], zoom = 12, className }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey || '' })

  if (!apiKey) return <div className="text-sm text-red-600">Google Maps API key not configured.</div>
  if (!isLoaded) return <div>Loading map...</div>

  return (
    <div className={className}>
      <GoogleMap center={center} zoom={zoom} mapContainerStyle={{ width: '100%', height: '100%' }}>
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} />
        ))}
      </GoogleMap>
    </div>
  )
}
