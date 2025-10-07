import { StrictMode, Suspense, lazy } from 'react'
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
const AdminDashboard = lazy(()=>import('./pages/admin/AdminDashboard.jsx'))
const BookingWizard = lazy(()=>import('./pages/tourist/BookingFlow/BookingWizard.jsx'))
import { HelmetProvider } from 'react-helmet-async'
const HowItWorks = lazy(()=>import('./pages/public/HowItWorks.jsx'))
const SearchResults = lazy(()=>import('./pages/public/SearchResults.jsx'))
const ActivityDetails = lazy(()=>import('./pages/public/ActivityDetails.jsx'))
const Experiences = lazy(()=>import('./pages/public/Experiences.jsx'))
import MyBookings from './pages/tourist/MyBookings.jsx'
import ReviewForm from './pages/tourist/ReviewForm.jsx'
import MyReviews from './pages/tourist/MyReviews.jsx'
const FarmerDashboard = lazy(()=>import('./pages/farmer/FarmerDashboard.jsx'))
const FarmRegistration = lazy(()=>import('./pages/farmer/FarmRegistration.jsx'))
const FarmManage = lazy(()=>import('./pages/farmer/FarmManage.jsx'))
const ManageActivities = lazy(()=>import('./pages/farmer/ManageActivities.jsx'))
const ActivityCreation = lazy(()=>import('./pages/farmer/ActivityCreation.jsx'))
const GuideDashboard = lazy(()=>import('./pages/provider/guide/GuideDashboard.jsx'))
const GuideRequests = lazy(()=>import('./pages/provider/guide/GuideRequests.jsx'))
const GuideAvailability = lazy(()=>import('./pages/provider/guide/GuideAvailability.jsx'))
const TransportDashboard = lazy(()=>import('./pages/provider/transport/TransportDashboard.jsx'))
const TransportRequests = lazy(()=>import('./pages/provider/transport/TransportRequests.jsx'))
const Chat = lazy(()=>import('./pages/messages/Chat.jsx'))
const NotificationsCenter = lazy(()=>import('./pages/notifications/NotificationsCenter.jsx'))
const Favorites = lazy(()=>import('./pages/favorites/Favorites.jsx'))
const AIAssistant = lazy(()=>import('./pages/ai/AIAssistant.jsx'))
const AdminUsers = lazy(()=>import('./pages/admin/Users.jsx'))
const Verifications = lazy(()=>import('./pages/admin/Verifications.jsx'))
const ReviewsModeration = lazy(()=>import('./pages/admin/ReviewsModeration.jsx'))
const FeedbackManagement = lazy(()=>import('./pages/admin/FeedbackManagement.jsx'))
const Payouts = lazy(()=>import('./pages/admin/Payouts.jsx'))
const Reports = lazy(()=>import('./pages/admin/Reports.jsx'))
const PublicStats = lazy(()=>import('./pages/public/PublicStats.jsx'))
const ActivityEdit = lazy(()=>import('./pages/farmer/ActivityEdit.jsx'))
const CategoryTagManager = lazy(()=>import('./pages/admin/CategoryTagManager.jsx'))
const Promotions = lazy(()=>import('./pages/admin/Promotions.jsx'))
import About from './pages/static/About.jsx'
import Terms from './pages/static/Terms.jsx'
import Privacy from './pages/static/Privacy.jsx'
import FAQ from './pages/static/FAQ.jsx'
import Contact from './pages/static/Contact.jsx'

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
            <Route path="how-it-works" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><HowItWorks /></Suspense>} />
            <Route path="search" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><SearchResults /></Suspense>} />
            <Route path="experiences" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Experiences /></Suspense>} />
            <Route path="experience/:id" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><ActivityDetails /></Suspense>} />
            <Route path="destinations" element={<PublicStats />} />
            <Route path="about" element={<About />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />

            {/* Tourist */}
            <Route element={<ProtectedRoute roles={["Tourist"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="dashboard" element={<div className="p-6">Tourist Dashboard</div>} />
                <Route path="bookings/new" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><BookingWizard /></Suspense>} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="reviews" element={<MyReviews />} />
                <Route path="reviews/new" element={<ReviewForm />} />
              </Route>
            </Route>

            {/* Farmer */}
            <Route element={<ProtectedRoute roles={["Farmer"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="farmer/dashboard" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><FarmerDashboard /></Suspense>} />
                <Route path="farmer/farm" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><FarmRegistration /></Suspense>} />
                <Route path="farmer/farm/manage" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><FarmManage /></Suspense>} />
                <Route path="farmer/activities" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><ManageActivities /></Suspense>} />
                <Route path="farmer/activities/create" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><ActivityCreation /></Suspense>} />
                <Route path="farmer/activities/:id/edit" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><ActivityEdit /></Suspense>} />
              </Route>
            </Route>

            {/* Provider - Guide */}
            <Route element={<ProtectedRoute roles={["TourGuide"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="guide/dashboard" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><GuideDashboard /></Suspense>} />
                <Route path="guide/requests" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><GuideRequests /></Suspense>} />
                <Route path="guide/calendar" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><GuideAvailability /></Suspense>} />
              </Route>
            </Route>

            {/* Provider - Transport */}
            <Route element={<ProtectedRoute roles={["TransportProvider"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="transport/dashboard" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><TransportDashboard /></Suspense>} />
                <Route path="transport/requests" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><TransportRequests /></Suspense>} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute roles={["Administrator"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="/admin" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><AdminDashboard /></Suspense>} />
                <Route path="/admin/users" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><AdminUsers /></Suspense>} />
                <Route path="/admin/verifications" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Verifications /></Suspense>} />
                <Route path="/admin/reviews" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><ReviewsModeration /></Suspense>} />
                <Route path="/admin/feedback" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><FeedbackManagement /></Suspense>} />
                <Route path="/admin/payouts" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Payouts /></Suspense>} />
                <Route path="/admin/reports" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Reports /></Suspense>} />
                <Route path="/admin/categories" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><CategoryTagManager /></Suspense>} />
                <Route path="/admin/promotions" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Promotions /></Suspense>} />
              </Route>
            </Route>
            {/* Shared */}
            <Route element={<ProtectedRoute roles={["Tourist","Farmer","TourGuide","TransportProvider","Administrator"]} />}> 
              <Route element={<ProtectedLayout />}>
                <Route path="messages" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Chat /></Suspense>} />
                <Route path="notifications" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><NotificationsCenter /></Suspense>} />
                <Route path="favorites" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><Favorites /></Suspense>} />
                <Route path="ai" element={<Suspense fallback={<div className='p-6'>Loading…</div>}><AIAssistant /></Suspense>} />
              </Route>
            </Route>
          </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
