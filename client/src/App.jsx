import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Outlet />
      <ToastContainer position="top-right" newestOnTop closeOnClick theme="light" />
    </div>
  )
}

export default App
