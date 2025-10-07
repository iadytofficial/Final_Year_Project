import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin

let socket

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true })
  }
  return socket
}

export function joinRoom(room) {
  const s = getSocket()
  s.emit('join', room)
}

export function onTyping(callback) {
  const s = getSocket()
  s.on('typing', callback)
  return () => s.off('typing', callback)
}
