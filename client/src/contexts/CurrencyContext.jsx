import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }){
  const [currency,setCurrency]=useState(import.meta.env.VITE_DEFAULT_CURRENCY||'LKR')
  const [rates,setRates]=useState({})
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/public/rates'); setRates(data?.rates||{})}catch{}})()},[])

  const convert = useCallback((amount, to=currency)=>{
    if (!amount) return 0
    if (to==='LKR') return amount
    const rate = rates[to]
    if (!rate) return amount
    return amount * rate
  },[rates,currency])

  const value = useMemo(()=>({ currency, setCurrency, convert }),[currency, convert])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(){
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
