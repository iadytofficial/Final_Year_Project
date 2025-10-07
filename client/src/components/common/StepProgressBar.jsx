export default function StepProgressBar({ steps, current }) {
  return (
    <ol className="flex items-center justify-center gap-3 py-4">
      {steps.map((label, idx) => {
        const state = idx < current ? 'completed' : idx === current ? 'current' : 'upcoming'
        return (
          <li key={label} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${state==='completed'?'bg-brand text-white':state==='current'?'border-2 border-brand text-brand':'border-2 border-gray-300 text-gray-400'}`}>{idx+1}</span>
            <span className={`text-sm ${state==='current'?'text-brand font-medium':'text-gray-600'}`}>{label}</span>
            {idx < steps.length-1 && <span className="mx-2 h-px w-8 bg-gray-300" />}
          </li>
        )
      })}
    </ol>
  )
}
