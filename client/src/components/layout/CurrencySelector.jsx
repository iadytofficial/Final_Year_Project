import { useCurrency } from '../../contexts/CurrencyContext'

export default function CurrencySelector(){
  const { currency, setCurrency } = useCurrency()
  return (
    <select value={currency} onChange={(e)=>setCurrency(e.target.value)} className="rounded border px-2 py-1 text-sm">
      {['LKR','USD','EUR','GBP','INR'].map((c)=> <option key={c} value={c}>{c}</option>)}
    </select>
  )
}
