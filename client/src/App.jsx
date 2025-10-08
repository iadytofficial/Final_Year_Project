import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/common/ErrorBoundary'
import GA4 from './components/analytics/GA4'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <ToastContainer position="top-right" newestOnTop closeOnClick theme="light" />
      <GA4 />
    </div>
  )
}

export default App
