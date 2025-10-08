import { useEffect, useRef, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ role:'system', content:'How can I help you with your booking?' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  const send = async () => {
    if (!input) return
    const next = [...messages, { role:'user', content: input }]
    setMessages(next)
    setInput('')
    setTyping(true)
    try {
      const { data } = await api.post('/ai/chatbot', { message: input, context: { flow: 'booking' } })
      setMessages((m)=> [...m, { role:'assistant', content: data?.reply || '...' }])
    } catch {
      setMessages((m)=> [...m, { role:'assistant', content: 'Sorry, I had trouble answering that.' }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">AI Assistant</h1>
        <div className="h-96 overflow-y-auto rounded border bg-white p-3">
          {messages.map((m,i)=> (
            <div key={i} className={`mb-2 ${m.role==='user'?'text-right':''}`}>
              <span className={`inline-block rounded px-3 py-2 text-sm ${m.role==='user'?'bg-brand text-white':'bg-gray-100'}`}>{m.content}</span>
            </div>
          ))}
          {typing && <div className="text-sm text-gray-500">Assistant is typing…</div>}
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask about activities, bookings, etc." className="w-full rounded border px-3 py-2" />
          <button onClick={send} className="rounded bg-brand px-4 py-2 text-white">Send</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}
