import { useEffect, useRef, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import { getSocket, joinRoom } from '../../services/socket'
import api from '../../services/api'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [bookingId, setBookingId] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const load = async () => {
    if (!bookingId) return
    const { data } = await api.get(`/messages/conversation/${bookingId}`)
    setMessages(data?.items || data || [])
    joinRoom(`booking:${bookingId}`)
    const s = getSocket()
    s.on('message', (m) => setMessages((list) => [...list, m]))
    return () => s.off('message')
  }

  const send = async () => {
    if (!bookingId || !text) return
    await api.post('/messages/send', { bookingId, content: text })
    setText('')
  }

  useEffect(()=>{
    const s = getSocket()
    if (!bookingId) return
    const typingPayload = { room: `booking:${bookingId}` }
    const onTyping = ()=>{
      const indicator = document.getElementById('typing-indicator')
      if (indicator){ indicator.textContent = 'Typing…'; setTimeout(()=>{ indicator.textContent=''; }, 1500) }
    }
    s.on('typing', onTyping)
    const onInput = ()=> s.emit('typing', typingPayload)
    const inputEl = document.getElementById('chat-input')
    inputEl?.addEventListener('input', onInput)
    return ()=>{ s.off('typing', onTyping); inputEl?.removeEventListener('input', onInput) }
  },[bookingId])

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Messages</h1>
        <div className="mb-3">
          <input value={bookingId} onChange={(e)=>setBookingId(e.target.value)} placeholder="Enter Booking ID" className="w-full rounded border px-3 py-2" />
          <button onClick={load} className="mt-2 rounded bg-brand px-3 py-2 text-white">Load Conversation</button>
        </div>
        <div className="h-80 overflow-y-auto rounded border bg-white p-3">
          {messages.map((m, i) => (
            <div key={i} className="mb-2 text-sm"><span className="font-medium">{m.senderName||m.SenderID?.FullName||m.SenderID}:</span> {m.Content||m.content}</div>
          ))}
          <div ref={endRef} />
        </div>
        <div id="typing-indicator" className="mt-1 h-5 text-xs text-gray-500" />
        <div className="mt-3 flex gap-2">
          <input id="chat-input" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" className="w-full rounded border px-3 py-2" />
          <button onClick={send} className="rounded bg-brand px-4 py-2 text-white">Send</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}
