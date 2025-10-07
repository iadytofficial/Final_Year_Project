export default function ShareButtons({ url, text }){
  const shareUrl = encodeURIComponent(url || window.location.href)
  const shareText = encodeURIComponent(text || document.title)
  return (
    <div className="flex items-center gap-2 text-sm">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1">Facebook</a>
      <a href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1">WhatsApp</a>
      <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1">Twitter</a>
      <a href={`https://www.instagram.com/`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1">Instagram</a>
    </div>
  )
}
