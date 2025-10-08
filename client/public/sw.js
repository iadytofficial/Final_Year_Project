self.addEventListener('install', (e)=>{ self.skipWaiting() })
self.addEventListener('activate', (e)=>{ self.clients.claim() })
self.addEventListener('fetch', (event)=>{
  // Simple pass-through for now; hook for future caching
})
