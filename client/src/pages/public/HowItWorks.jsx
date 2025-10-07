import PublicLayout from './PublicLayout'

export default function HowItWorks() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">How It Works</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-medium">For Tourists</h2>
            <ol className="mt-2 list-decimal pl-5 text-gray-700 space-y-1">
              <li>Search</li>
              <li>Book</li>
              <li>Experience</li>
            </ol>
          </div>
          <div>
            <h2 className="font-medium">For Farmers</h2>
            <ol className="mt-2 list-decimal pl-5 text-gray-700 space-y-1">
              <li>Register</li>
              <li>List</li>
              <li>Earn</li>
            </ol>
          </div>
          <div>
            <h2 className="font-medium">For Service Providers</h2>
            <ol className="mt-2 list-decimal pl-5 text-gray-700 space-y-1">
              <li>Apply</li>
              <li>Get Verified</li>
              <li>Accept Jobs</li>
            </ol>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
