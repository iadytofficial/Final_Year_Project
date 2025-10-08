import { useCurrency } from '../../contexts/CurrencyContext'

export default function Price({ amountLkr }){
  const { currency, convert } = useCurrency()
  const converted = convert(amountLkr, currency)
  const formatted = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency==='LKR'?'LKR':'USD' }).format(converted)
  return <span>{formatted}</span>
}
