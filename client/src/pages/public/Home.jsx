import PublicLayout from './PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-3xl font-bold">Discover authentic agro experiences in Sri Lanka</h1>
        <p className="mt-2 text-gray-600">Search farm tours, hands-on activities, and rural stays.</p>
      </section>
    </PublicLayout>
  )
}
