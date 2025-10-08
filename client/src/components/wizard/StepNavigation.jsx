export default function StepNavigation({ onBack, onNext, nextDisabled, backLabel='Back', nextLabel='Next' }) {
  return (
    <div className="mt-6 flex justify-between">
      <button type="button" onClick={onBack} className="rounded border px-4 py-2">{backLabel}</button>
      <button type="submit" disabled={nextDisabled} className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50">{nextLabel}</button>
    </div>
  )
}
