import ProtectedLayout from '../../components/common/ProtectedLayout'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function CategoryTagManager(){
  const [categories,setCategories]=useState([])
  const [selected,setSelected]=useState(null)
  const [tags,setTags]=useState([])

  const loadCats = async ()=>{ const {data}=await api.get('/activities/categories'); setCategories(data||[]) }
  const loadTags = async (categoryId)=>{ const {data}=await api.get(`/activities/tags/${categoryId}`); setTags(data||[]) }
  useEffect(()=>{loadCats()},[])

  const addCategory = async (e)=>{ e.preventDefault(); const name = e.target.name.value; if(!name) return; await api.post('/admin/categories/create',{ CategoryName: name }); toast.success('Category created'); loadCats() }
  const addTag = async (e)=>{ e.preventDefault(); const name = e.target.name.value; if(!name || !selected) return; await api.post('/admin/tags/create',{ CategoryID: selected, TagName: name }); toast.success('Tag created'); loadTags(selected) }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Categories & Tags</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-2 font-medium">Categories</h2>
            <ul className="space-y-1">
              {categories.map((c)=> (
                <li key={c.CategoryID||c._id} className="flex items-center justify-between">
                  <button className={`text-left ${selected===(c.CategoryID||c._id)?'text-brand':''}`} onClick={()=>{setSelected(c.CategoryID||c._id); loadTags(c.CategoryID||c._id)}}>{c.CategoryName||c.name||'Category'}</button>
                </li>
              ))}
            </ul>
            <form onSubmit={addCategory} className="mt-3 flex gap-2">
              <input name="name" placeholder="New category" className="w-full rounded border px-3 py-2" />
              <button className="rounded bg-brand px-3 py-2 text-white">Add</button>
            </form>
          </div>
          <div className="rounded border bg-white p-4">
            <h2 className="mb-2 font-medium">Tags</h2>
            {!selected? <p className="text-sm text-gray-600">Select a category</p> : (
              <>
                <ul className="space-y-1">
                  {tags.map((t)=> (
                    <li key={t.TagID||t._id}>{t.TagName||t.name||'Tag'}</li>
                  ))}
                </ul>
                <form onSubmit={addTag} className="mt-3 flex gap-2">
                  <input name="name" placeholder="New tag" className="w-full rounded border px-3 py-2" />
                  <button className="rounded bg-brand px-3 py-2 text-white">Add</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}