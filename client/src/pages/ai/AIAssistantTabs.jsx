import { useState } from 'react'
import AIAssistant from './AIAssistant'

function Tab({label, active, onClick}){ return <button onClick={onClick} className={`rounded px-3 py-1 text-sm ${active?'bg-brand text-white':'border'}`}>{label}</button> }

export default function AIAssistantTabs(){
  const [tab,setTab]=useState('summary')
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-3 flex gap-2">
        <Tab label="Quick Summary" active={tab==='summary'} onClick={()=>setTab('summary')} />
        <Tab label="Details" active={tab==='details'} onClick={()=>setTab('details')} />
        <Tab label="Creative" active={tab==='creative'} onClick={()=>setTab('creative')} />
        <Tab label="Related" active={tab==='related'} onClick={()=>setTab('related')} />
      </div>
      <div className="rounded border bg-white p-4">
        <AIAssistant />
      </div>
    </div>
  )
}
