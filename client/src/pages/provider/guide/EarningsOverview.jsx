import ProtectedLayout from '../../../components/common/ProtectedLayout'
import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function EarningsOverview(){
  const [series,setSeries]=useState([])
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/guides/earnings'); setSeries(data?.series||[])}catch{}})()},[])
  const data = { labels: series.map(x=>x.label), datasets:[{label:'Earnings', data: series.map(x=>x.value), borderColor:'#16a34a', backgroundColor:'rgba(22,163,74,0.2)'}] }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Earnings Overview</h1>
        <div className="rounded border bg-white p-4"><Line data={data} height={220} /></div>
      </div>
    </ProtectedLayout>
  )
}