import { NavLink } from 'react-router-dom'

export default function Sidebar({ items }) {
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded px-3 py-2 text-sm ${isActive ? 'bg-brand/10 text-brand' : 'hover:bg-gray-50'}`}>{item.label}</NavLink>
        ))}
      </nav>
    </aside>
  )
}
