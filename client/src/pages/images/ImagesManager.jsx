import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ImagesManager({ entityType, entityId }) {
  const [items, setItems] = useState([])
  const [dragIndex, setDragIndex] = useState(null)

  useEffect(()=>{(async()=>{try{const {data}=await api.get(`/images?entityType=${entityType}&entityId=${entityId}`); setItems(data?.items||[])}catch{}})()},[entityType, entityId])

  const remove = async (imageId) => {
    await api.delete(`/images/${imageId}`)
    setItems((arr)=>arr.filter((i)=> (i.ImageID||i._id)!==imageId))
  }
  const setPrimary = async (imageId) => {
    await api.put(`/images/${imageId}/set-primary`)
    setItems((arr)=>arr.map((i)=> ({...i, IsPrimary: (i.ImageID||i._id)===imageId})))
  }
  const saveOrder = async () => {
    const order = items.map((it, idx)=> ({ imageId: it.ImageID||it._id, order: idx }))
    await api.put('/images/reorder', { order })
  }

  const onDragStart = (idx)=> setDragIndex(idx)
  const onDragOver = (e)=> e.preventDefault()
  const onDrop = (idx)=> {
    if (dragIndex==null) return
    const next = [...items]
    const [moved] = next.splice(dragIndex,1)
    next.splice(idx,0,moved)
    setItems(next)
    setDragIndex(null)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((img, idx)=> (
          <div key={img.ImageID||img._id} className={`relative rounded border p-2 ${img.IsPrimary?'ring-2 ring-brand':''}`} draggable onDragStart={()=>onDragStart(idx)} onDragOver={onDragOver} onDrop={()=>onDrop(idx)}>
            <img src={img.Thumbnail300||img.Url} alt={img.AltText||''} className="h-28 w-full object-cover" />
            <div className="mt-2 flex justify-between text-xs">
              <button onClick={()=>setPrimary(img.ImageID||img._id)} className="rounded border px-2 py-0.5">Primary</button>
              <button onClick={()=>remove(img.ImageID||img._id)} className="rounded border px-2 py-0.5 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-right">
        <button onClick={saveOrder} className="rounded bg-brand px-4 py-2 text-white">Save Order</button>
      </div>
    </div>
  )
}
