import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Home from './pages/public/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import EmailVerification from './pages/auth/EmailVerification.jsx'
import ProtectedLayout from './components/common/ProtectedLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import BookingWizard from './pages/tourist/BookingFlow/BookingWizard.jsx'
import { HelmetProvider } from 'react-helmet-async'
import HowItWorks from './pages/public/HowItWorks.jsx'
import SearchResults from './pages/public/SearchResults.jsx'
import ActivityDetails from './pages/public/ActivityDetails.jsx'
import MyBookings from './pages/tourist/MyBookings.jsx'
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx'
import FarmRegistration from './pages/farmer/FarmRegistration.jsx'
import ManageActivities from './pages/farmer/ManageActivities.jsx'
import ActivityCreation from './pages/farmer/ActivityCreation.jsx'
import GuideDashboard from './pages/provider/guide/GuideDashboard.jsx'
import GuideRequests from './pages/provider/guide/GuideRequests.jsx'
import GuideAvailability from './pages/provider/guide/GuideAvailability.jsx'
import TransportDashboard from './pages/provider/transport/TransportDashboard.jsx'
import TransportRequests from './pages/provider/transport/TransportRequests.jsx'
import Chat from './pages/messages/Chat.jsx'
import NotificationsCenter from './pages/notifications/NotificationsCenter.jsx'
import Favorites from './pages/favorites/Favorites.jsx'
import AIAssistant from './pages/ai/AIAssistant.jsx'
import AdminUsers from './pages/admin/Users.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<App />}> 
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email/:token" element={<EmailVerification />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="experience/:id" element={<ActivityDetails />} />

            {/* Tourist */}
            <Route element={<ProtectedRoute roles={["Tourist"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="dashboard" element={<div className="p-6">Tourist Dashboard</div>} />
                <Route path="bookings/new" element={<BookingWizard />} />
                <Route path="bookings" element={<MyBookings />} />
              </Route>
            </Route>

            {/* Farmer */}
            <Route element={<ProtectedRoute roles={["Farmer"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="farmer/farm" element={<FarmRegistration />} />
                <Route path="farmer/activities" element={<ManageActivities />} />
                <Route path="farmer/activities/create" element={<ActivityCreation />} />
              </Route>
            </Route>

            {/* Provider - Guide */}
            <Route element={<ProtectedRoute roles={["TourGuide"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="guide/dashboard" element={<GuideDashboard />} />
                <Route path="guide/requests" element={<GuideRequests />} />
                <Route path="guide/calendar" element={<GuideAvailability />} />
              </Route>
            </Route>

            {/* Provider - Transport */}
            <Route element={<ProtectedRoute roles={["TransportProvider"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="transport/dashboard" element={<TransportDashboard />} />
                <Route path="transport/requests" element={<TransportRequests />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute roles={["Administrator"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>
            {/* Shared */}
            <Route element={<ProtectedRoute roles={["Tourist","Farmer","TourGuide","TransportProvider","Administrator"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="messages" element={<Chat />} />
                <Route path="notifications" element={<NotificationsCenter />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="ai" element={<AIAssistant />} />
              </Route>
            </Route>
          </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
