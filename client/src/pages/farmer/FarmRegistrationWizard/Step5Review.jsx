export default function Step5Review({ data }) {
  return (
    <div className="space-y-3 text-sm">
      <pre className="whitespace-pre-wrap rounded border bg-gray-50 p-3">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
