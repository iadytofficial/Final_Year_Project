## AgroLK Platform - Complete Development Specification

Version: 1.0
Date: 2025-10-05

### Project Overview
AgroLK is a full-stack agro-tourism platform connecting Sri Lankan farmers with international tourists. It enables farmers to list authentic agricultural experiences, tourists to search and book packages (activities, guides, transport), and administrators to manage verifications, payments, reports, and platform operations. This specification consolidates the complete scope including missing features, security, integrations, and production-readiness.

### Objectives
- Provide seamless discovery and booking of farm-based experiences.
- Onboard and verify service providers (farmers, tour guides, transport providers).
- Handle end-to-end payments, escrow, refunds, and payouts.
- Deliver real-time messaging, notifications, and automated broadcasts.
- Offer AI features: image identification and chatbot assistance.
- Supply comprehensive analytics, reports, and admin tooling.

## Technology Stack

### Backend
- Node.js (LTS), Express.js
- MongoDB (Replica Set recommended), Mongoose
- JWT (access + refresh tokens)
- Bcrypt (10 rounds)
- Nodemailer (SMTP), Bull/BullMQ for email queueing via Redis
- Multer for uploads, Sharp for image processing
- CORS, Helmet, express-rate-limit
- Dotenv for configuration
- Socket.io for WebSockets (real-time notifications, chat, broadcast)
- Stripe/PayPal SDKs (sandbox + production)
- Winston/Pino for logging; MongoDB/Cloud logging sink
- Redis for caching and job queues

### Frontend
- React.js (functional + hooks)
- React Router DOM
- Axios
- Tailwind CSS
- Chart.js + react-chartjs-2
- React-Toastify
- React Date Pickers (e.g., react-datepicker)
- Google Maps JavaScript API
- Image upload with preview using FileReader + drag & drop
- PWA (service worker, manifest)

### WebSocket Real-time
- Socket.io client + server
- Namespaces/rooms per `userId`, `bookingId`, `broadcast` channels
- Events: booking:new, booking:status, message:new, notification:new, service:broadcast, payment:confirmation, user:typing, user:online
- Reconnection with exponential backoff; missed events sync on reconnect

### Third-party Integrations
- Google Maps API (geocoding, places, distance matrix)
- Google Cloud Vision API (image recognition)
- Google Gemini API (content generation for chatbot/assistant)
- Stripe/PayPal (payment intents, webhooks, refunds, payouts)
- CDN (e.g., Cloudflare/Akamai) for images

## Architecture & Code Structure

```
/server
  /config
  /controllers
  /models
  /routes
  /middleware
  /utils
  /services
  /validators
  server.js

/client
  /src
    /components
    /pages
    /contexts
    /hooks
    /services
    /utils
    /assets
    App.jsx
    index.js
/docs
  AgroLK_Specification.md
  API-Error-Codes.md (logical duplication inline below)
  API-Validation-Rules.md (logical duplication inline below)
```

- Layered architecture with clear separation of concerns.
- RESTful APIs, OpenAPI 3.1 spec to be maintained in `docs/openapi.yaml`.
- Centralized error handling middleware and error code catalog.
- RBAC via middleware; route-level guards.

## Environment Variables
All environment variables are listed in `.env.example`. See Environment Configuration appendix.

## Security & Compliance
- HTTPS only, secure cookies (frontend), HSTS
- JWT access (24h) and refresh tokens (30d) with rotation
- Role-based access control (Tourist, Farmer, TourGuide, TransportProvider, Administrator)
- Password hashing with bcrypt (10 rounds)
- Account lockout after 5 failed attempts (15 min)
- Input validation and sanitization; XSS, CSRF protections
- Rate limiting (default 100 req/min)
- Sensitive data encryption at rest (bank details, tokens)
- IP + device fingerprint binding for sessions; suspicious activity detection and auto-logout
- Audit trails for critical actions

## Validation Rules
- Email: RFC 5322 + domain MX check
- Phone: E.164 with `+` country code (Sri Lanka +94 supported)
- Password: min 8 chars, 1 uppercase, 1 number, 1 special
- Price: positive; 2 decimal places max
- Rating: integer 1–5
- Images: <= 5MB, MIME in image/jpeg,image/png,image/webp
- Dates: future for bookings; ISO 8601
- Text: HTML sanitized to prevent XSS
- NIC: Sri Lankan format validation
- Vehicle Registration: Sri Lankan format validation

## Error Codes
- AUTH001 Invalid credentials
- AUTH002 Token expired
- AUTH003 Unauthorized access
- BOOK001 Slot unavailable
- BOOK002 Invalid date
- BOOK003 Insufficient participants
- PAY001 Payment failed
- PAY002 Insufficient funds
- PAY003 Card declined
- VAL001 Validation error
- VAL002 Required field missing
- SYS001 Internal server error
- SYS002 Database connection error
- SYS003 Third-party service error

## Session Management
- Session timeout: 30 minutes inactivity for access tokens; refresh tokens extend sessions (remember me: 30 days)
- Concurrent session limit: 3 devices
- Session invalidation on password change and suspicious activity
- IP-based validation + device fingerprinting
- Endpoints: logout, refresh-token, sessions list, delete specific session

## Database Schema
MongoDB collections and fields (exact naming and relationships). All `ObjectId` are MongoDB ObjectId. Referencing uses ObjectId refs.

### Users
- UserID (ObjectId, auto-generated)
- FullName (String, required)
- Email (String, unique, required)
- Password (String, hashed, required)
- PhoneNumber (String, required)
- Role (String, enum: ['Tourist','Farmer','TourGuide','TransportProvider','Administrator'])
- ProfilePic (String, URL)
- CreatedAt (Date)
- EmailVerified (Boolean, default: false)
- VerificationToken (String)
- FailedLoginAttempts (Number, default: 0)
- LastLoginAt (Date)

### Farms
- FarmID (ObjectId)
- UserID (Reference to Users)
- FarmName (String, required)
- FarmType (String)
- VerificationStatus (String, enum: ['Pending','Approved','Rejected'])
- Description (String, max 1000)
- Location (Object: { address, coordinates: { lat, lng } })
- Facilities (Array<String>)
- Images (Array<String URL>)

### TourGuides
- GuideID (ObjectId)
- UserID (Reference to Users)
- LicenseNumber (String, unique)
- NIC (String, unique)
- VerificationStatus (String, enum: ['Pending','Approved','Rejected'])
- YearsOfExperience (Number)
- LanguageSpoken (Array<String>)
- Bio (String)
- PricePerDay (Number)
- AvailabilityCalendar (Array<Date>)

### TransportProviders
- TransportProviderID (ObjectId)
- UserID (Reference to Users)
- VehicleType (String)
- VehicleRegistrationNo (String, unique)
- VerificationStatus (String, enum: ['Pending','Approved','Rejected'])
- MaxPassengers (Number)
- LicenseCardPic (String, URL)
- PricePerKm (Number)
- AvailabilityCalendar (Array<Date>)

### ActivityCategories
- CategoryID (ObjectId)
- CategoryName (String, unique)
- Description (String)
- IsActive (Boolean)

### ActivityTags
- TagID (ObjectId)
- CategoryID (Reference to ActivityCategories)
- TagName (String)
- IsActive (Boolean)

### Activities
- ActivityID (ObjectId)
- FarmID (Reference to Farms)
- CategoryID (Reference to ActivityCategories)
- TagIDs (Array<Reference to ActivityTags>)
- CustomTitle (String, required)
- Status (String, enum: ['Active','Inactive'])
- CustomDescription (String)
- PricePerPerson (Number, required)
- DurationHours (Number)
- MaxParticipants (Number)
- Images (Array<String URL>)
- AvailabilityCalendar (Object: { dates: { 'YYYY-MM-DD': { slots: { Morning, Afternoon, Evening, FullDay }, capacityPerSlot, blackout: Array<date>, seasonalRules, recurringRules, holidayRules, lastMinuteEnabled, advanceBookingLimitDays }}})

### Bookings
- BookingID (ObjectId)
- TouristID (Reference to Users)
- ActivityID (Reference to Activities)
- GuideID (Reference to TourGuides, optional)
- TransportProviderID (Reference to TransportProviders, optional)
- ActivityDate (Date)
- NumberOfParticipants (Number)
- TotalCost (Number)
- Status (String, enum: ['Pending','Confirmed','Completed','Cancelled'])
- GuideStatus (String, enum: ['NotRequested','Pending','Confirmed','Declined'])
- TransportStatus (String, enum: ['NotRequested','Pending','Confirmed','Declined'])
- BookingDate (Date)
- SpecialRequests (String)
- CancellationRequested (Boolean, default: false)
- CancellationReason (String)

### Payments
- PaymentID (ObjectId)
- BookingID (Reference to Bookings)
- Amount (Number)
- Status (String, enum: ['Pending','Success','Failed','Refunded'])
- TransactionID (String)
- PaymentMethod (String)
- PaymentDate (Date)
- RefundAmount (Number)
- RefundDate (Date)
- RefundReason (String)

### Refunds (NEW)
- RefundID (ObjectId)
- PaymentID (Reference to Payments)
- BookingID (Reference to Bookings)
- Amount (Number)
- RefundDate (Date)
- Reason (String)
- Status (String)
- ProcessedBy (Reference to Users with Administrator role)
- RefundMethod (String)

### Reviews
- ReviewID (ObjectId)
- BookingID (Reference to Bookings)
- ReviewerID (Reference to Users)
- Rating (Number 1–5)
- Comment (String, max 500)
- ModerationStatus (String, enum: ['Pending','Approved','Rejected'])
- ModeratorID (Reference to Users, optional)
- CreatedAt (Date)
- Images (Array<String URL>, optional)
- SubRatings (Object: { Authenticity, ValueForMoney, HostCommunication, Cleanliness, Location } integers 1–5)

### Messages
- MessageID (ObjectId)
- BookingID (Reference to Bookings)
- SenderID (Reference to Users)
- ReceiverID (Reference to Users)
- Content (String)
- Timestamp (Date)
- IsRead (Boolean)
- TypingIndicator (Boolean, transient)

### Notifications
- NotificationID (ObjectId)
- UserID (Reference to Users)
- Message (String)
- Type (String, enum: ['Booking','Payment','Review','System'])
- RelatedID (ObjectId)
- IsRead (Boolean)
- CreatedAt (Date)

### VerificationLog
- LogID (ObjectId)
- ProviderUserID (Reference to Users)
- AdminUserID (Reference to Users)
- Action (String, enum: ['Approved','Rejected'])
- Comments (String)
- Timestamp (Date)
- DocumentsVerified (Array<String>)

### Feedback
- FeedbackID (ObjectId)
- UserID (Reference to Users)
- Category (String, enum: ['Bug','Feature','Complaint','Other'])
- Message (String)
- Status (String, enum: ['Open','InProgress','Resolved'])
- SubmittedAt (Date)
- AdminResponse (String)
- RespondedAt (Date)

### Payouts (Expanded)
- PayoutID (ObjectId)
- UserID (Reference to service provider)
- Amount (Number)
- PayoutDate (Date)
- PaymentIDs (Array<Reference to Payments>)
- Status (String, enum: ['Pending','Completed','Failed'])
- BankDetails (Object, encrypted)
- AdminID (Reference to Users)
- PayoutMethod (String)
- BankAccountDetails (Encrypted Object)
- TaxDeduction (Number)
- NetAmount (Number)
- Invoice (String URL)
- PayoutPeriod (Object: { startDate, endDate })

### Favorites
- FavoriteID (ObjectId)
- UserID (Reference to Users)
- ActivityID (Reference to Activities)
- CreatedAt (Date)

### Searches
- SearchID (ObjectId)
- UserID (Reference to Users)
- Query (Object: { text, location, category, tags, date, participants, priceMin, priceMax })
- CreatedAt (Date)
- Popularity (Number)

### Promotions
- PromotionID (ObjectId)
- Code (String, unique)
- Type (String: 'Percentage'|'Fixed')
- Value (Number)
- ValidFrom (Date)
- ValidTo (Date)
- UsageLimit (Number)
- UsedCount (Number)
- ApplicableTo (Array<ActivityIDs>)

### PricingRules
- PricingRuleID (ObjectId)
- ActivityID (Reference to Activities)
- Rules (Object: peak/off-peak, weekend, holiday, group discounts)
- ValidFrom (Date)
- ValidTo (Date)

### AuditLogs
- LogID (ObjectId)
- UserID (Reference)
- Action (String)
- EntityType (String)
- EntityID (ObjectId)
- OldValue (Object)
- NewValue (Object)
- IPAddress (String)
- UserAgent (String)
- Timestamp (Date)

### SystemLogs
- LogLevel (String: 'ERROR'|'WARN'|'INFO'|'DEBUG')
- Message (String)
- Stack (String)
- Metadata (Object)
- Timestamp (Date)

### Sessions
- SessionID (ObjectId)
- UserID (Reference)
- RefreshTokenHash (String)
- DeviceFingerprint (String)
- IPAddress (String)
- UserAgent (String)
- CreatedAt (Date)
- LastUsedAt (Date)
- ExpiresAt (Date)

### PublicContent
- StoryID (ObjectId)
- Title (String)
- Body (String)
- Images (Array<String URL>)
- Type (String: 'SuccessStory'|'Destination')
- Location (Object: { address, coordinates })
- CreatedAt (Date)
- IsActive (Boolean)

### Indexing
- Ensure indexes on Email, LicenseNumber, VehicleRegistrationNo, foreign keys (UserID, ActivityID, BookingID), geo indexes for farm locations, and compound indexes for search filters.

## Predefined Activity Categories & Tags
Provide seed data for production via admin tools only (no dummy users). See list provided in requirements; store under `ActivityCategories` and `ActivityTags` exactly as given.

1) Farm Tours & Educational Experiences
- Spice Garden Tour, Tea Plucking, Tea Processing, Paddy Field Tour, Fruit Orchard Tour, Organic Farming Education, Traditional Farming Methods

2) Hands-On Farming Activities
- Harvesting (Rice, Tea, Vegetables, Fruits), Vegetable Planting, Spice Processing, Animal Feeding, Milking Experience, Composting Workshop

3) Farm-to-Table Culinary Experiences
- Traditional Cooking Class, Fruit Tasting, Tea Tasting, Spice Blending Workshop, Farm Lunch/Dinner, Breakfast Experience, Toddy Tapping Experience

4) Farm Stays & Rural Accommodation
- Traditional Homestay, Mud Hut Experience, Tree House Stay, Eco-Cabin, Camping

5) Nature & Recreation
- Bird Watching, Countryside Walk, Village Cycling Tour, Bullock Cart Ride, River Bathing, Waterfall Visit, Medicinal Plant Walk

6) Direct Farm Produce Market
- Fresh Vegetables, Seasonal Fruits, Spices, Tea Products, Homemade Products, Organic Produce

## API Endpoints
All endpoints are RESTful under `/api`. JWT access token required unless public.

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-email/:token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token
- GET  /api/auth/me
- POST /api/auth/logout
- POST /api/auth/refresh-token
- GET  /api/auth/sessions
- DELETE /api/auth/sessions/:sessionId

### Users
- GET  /api/users/profile
- PUT  /api/users/profile
- POST /api/users/upload-profile-pic
- DELETE /api/users/account

### Farmers
- POST /api/farmers/register-farm
- GET  /api/farmers/my-farm
- PUT  /api/farmers/update-farm
- POST /api/farmers/upload-farm-images
- DELETE /api/farmers/farm-image/:imageId
- GET  /api/farmers/dashboard-stats
- GET  /api/farmers/bookings
- PUT  /api/farmers/booking/:bookingId/status

### Activities
- POST /api/activities/create
- GET  /api/activities/my-activities
- GET  /api/activities/:activityId
- PUT  /api/activities/:activityId
- DELETE /api/activities/:activityId
- POST /api/activities/:activityId/upload-images
- PUT  /api/activities/:activityId/availability
- GET  /api/activities/categories
- GET  /api/activities/tags/:categoryId

### Tourists
- GET  /api/search/activities
- GET  /api/activities/details/:activityId
- POST /api/bookings/check-availability
- POST /api/bookings/create
- GET  /api/bookings/my-bookings
- PUT  /api/bookings/:bookingId/cancel
- POST /api/reviews/create
- GET  /api/reviews/my-reviews

### Tour Guides
- POST /api/guides/register
- GET  /api/guides/profile
- PUT  /api/guides/profile
- PUT  /api/guides/availability
- GET  /api/guides/booking-requests
- PUT  /api/guides/booking/:bookingId/respond
- GET  /api/guides/earnings

### Transport Providers
- POST /api/transport/register
- GET  /api/transport/profile
- PUT  /api/transport/profile
- PUT  /api/transport/availability
- GET  /api/transport/trip-requests
- PUT  /api/transport/trip/:bookingId/respond
- GET  /api/transport/earnings

### Payments
- POST /api/payments/create-intent
- POST /api/payments/confirm
- POST /api/payments/webhook
- GET  /api/payments/history
- POST /api/payments/refund/:paymentId

### Admin
- GET  /api/admin/users
- PUT  /api/admin/users/:userId/status
- GET  /api/admin/verifications/pending
- PUT  /api/admin/verify/:providerId
- GET  /api/admin/reviews/pending
- PUT  /api/admin/reviews/:reviewId/moderate
- GET  /api/admin/feedback
- PUT  /api/admin/feedback/:feedbackId/respond
- POST /api/admin/payouts/process
- GET  /api/admin/reports/revenue
- GET  /api/admin/reports/users
- GET  /api/admin/reports/bookings
- POST /api/admin/categories/create
- POST /api/admin/tags/create
- GET  /api/analytics/provider/:providerId
- GET  /api/analytics/provider/revenue
- GET  /api/analytics/provider/performance
- GET  /api/health
- GET  /api/health/detailed
- GET  /api/metrics
- GET  /api/export/bookings
- GET  /api/export/earnings
- GET  /api/export/users
- GET  /api/export/reviews

### AI Assistant
- POST /api/ai/identify-plant
- POST /api/ai/chatbot

AI Chatbot Features:
- Real-time chat interface with typing indicators (Socket.io)
- Context-aware booking assistance (Gemini + internal context)
- FAQ auto responses
- Booking flow guidance; escalation to human support
- Chat history persistence per user
- Multi-language support (Sinhala, Tamil, English)

AI Response Tabs:
1) Quick Summary (2–3 sentences)
2) Detailed Information (scientific name, local names, conditions, harvesting, health, culinary)
3) Creative Description (story)
4) Related Activities (suggestions with links)

### Messaging
- POST /api/messages/send
- GET  /api/messages/conversation/:bookingId
- PUT  /api/messages/:messageId/read

### Notifications
- GET  /api/notifications
- PUT  /api/notifications/:notificationId/read
- PUT  /api/notifications/read-all

### Images
- DELETE /api/images/:imageId
- PUT  /api/images/reorder
- PUT  /api/images/:imageId/set-primary

### Calendar & Availability
- GET  /api/calendar/availability/:providerId
- PUT  /api/calendar/bulk-update
- GET  /api/calendar/blackout-dates

### Search & Discovery
- GET  /api/search/suggestions
- GET  /api/search/popular
- POST /api/search/save
- GET  /api/search/saved

### Favorites/Wishlist
- POST   /api/favorites/add
- DELETE /api/favorites/remove
- GET    /api/favorites/list

### Public Statistics
- GET  /api/public/statistics
- GET  /api/public/success-stories
- GET  /api/public/destinations

### Cancellation & Modification
- POST /api/bookings/:bookingId/cancel
- POST /api/bookings/:bookingId/request-cancellation
- PUT  /api/bookings/:bookingId/modify

## Business Logic

### User Registration
1) Role selection; form validation
2) Unique email check; password hash with bcrypt
3) Generate email verification token (24h expiry); send email
4) Create user with `EmailVerified=false`
5) After verification: enable role-specific profile

### Email Verification
1) Generate UUID token with 24h expiry
2) Store token; send verification link
3) Verify on click; set `EmailVerified=true`; auto-login
4) Clean expired tokens daily

### Password Reset
1) Request via email; generate token with 1h expiry
2) Send reset link; validate token
3) Accept new password; invalidate sessions
4) Send confirmation email

### Service Provider Verification
1) Provider uploads documents per role
2) Status to Pending; admin notified
3) Admin approves/rejects with comments (logged in `VerificationLog`)
4) Provider notified; if approved, can list services

### Booking Process
1) Tourist searches; selects activity
2) System checks slot availability and capacity
3) Tourist selects optional guide/transport
4) If requested: broadcast to providers in 5km (configurable)
5) Payment intent; hold funds in escrow
6) Create booking Pending; farmer notified to confirm
7) On confirmation, booking Confirmed; all notified
8) Completion: set Completed; trigger payouts after 24h

### Availability Management
- Slots: Morning, Afternoon, Evening, FullDay
- Capacity per slot; blackout dates; seasonal and recurring patterns
- Holiday management; last-minute booking settings
- Advance booking limits (max 90 days configurable; default 3 months)
- Min 2 hours advance booking; max 90 days
- Buffer time between bookings; concurrent booking limits

### Automated Broadcast (Optional Services)
1) Compute radius (default 5km)
2) Query providers by proximity + availability
3) Send push via Socket.io and notification
4) Start 30-minute acceptance timer
5) First acceptance wins; notify others filled
6) Timeout => auto-refund and notify tourist
7) Log attempts and outcomes

### Review System
- Reviews only after completion date
- Moderation queue; auto or admin approval
- Average ratings update with sub-ratings and verified badge

### Payments & Distribution
- Escrow on confirmation
- Platform commission: 15% for farmers; 10% for guides; 10% for transport
- Gateway fee: 2.9% + $0.30 per transaction
- Payouts weekly; admin approves
- Refund policy and process below

### Cancellation & Refund Policy
- 48+ hours: 100% refund
- 24–48 hours: 50% refund
- <24 hours: No refund
- Provider cancellation: 100% refund + credit
- Weather cancellation: 100% refund
- No-show: No refund
- Partial service cancellations supported
- Refunds recorded in `Refunds`; tie back to gateway refund

### Currency Management
- Default currency: LKR; support USD, EUR, GBP, INR
- Real-time exchange rates via external API (synced every 30 min)
- Currency selector; geo-detected default; price display conversion with logs

### Quick Actions for Farmers
- One-click Add Activity
- View Today’s Bookings
- Update Availability
- View Pending Reviews
- Check Earnings
- Upload Photos
- Send Announcement
- Export Reports

## Search & Filtering
- Text search with fuzzy matching
- Geospatial queries (nearest first)
- Multi-field filtering (category, tags, date, participants, price range)
- Date availability checking per slot
- Rating threshold filtering
- Ranking algorithm combining relevance, proximity, rating, recency
- Store recent and popular searches

## Image Management
- Max 10 images per farm/activity
- Supported: JPG, PNG, WebP
- Compression to 80% with Sharp; thumbnails: 150x150, 300x300, 600x600
- CDN delivery with signed URLs
- Lazy loading on frontend
- Reordering and primary image selection endpoints
- Alt text required for accessibility

## Notification Types & Triggers
- Instant: new bookings, cancellations, messages
- Daily: reminders (1 day before)
- Weekly: earnings summary, pending actions
- System: verification status, platform updates
- Marketing: opt-in promotions
- Emergency: security alerts

## Reports & Visualizations (Admin)
- Revenue: monthly trends (line), by service type (pie), top farms (bar)
- User analytics: growth (area), distribution by role (donut), geographic heat map
- Booking analytics: by category (bar), calendar heat map, conversion funnel
- Export: PDF, CSV, Excel
- Scheduled generation; email delivery

## Frontend

### Routes
Public
- /, /how-it-works, /about, /contact, /faq, /terms, /privacy, /destinations, /experiences, /experience/:id, /search

Auth
- /login, /register, /verify-email/:token, /forgot-password, /reset-password/:token

Tourist
- /dashboard, /bookings, /bookings/:id, /favorites, /reviews, /messages, /profile, /settings

Farmer
- /farmer/dashboard, /farmer/farm, /farmer/activities, /farmer/activities/create, /farmer/activities/:id/edit, /farmer/bookings, /farmer/calendar, /farmer/earnings, /farmer/reviews

Service Provider
- /guide/dashboard, /guide/profile, /guide/requests, /guide/calendar, /guide/earnings
- /transport/dashboard, /transport/profile, /transport/requests, /transport/calendar, /transport/earnings

Admin
- /admin, /admin/users, /admin/verifications, /admin/bookings, /admin/reviews, /admin/feedback, /admin/reports, /admin/payouts, /admin/settings, /admin/categories, /admin/promotions

### Components
Layout
- Header.jsx (role-based nav; currency selector; notification bell)
- Footer.jsx, Sidebar.jsx, LoadingSpinner.jsx, ErrorBoundary.jsx

Authentication
- LoginForm.jsx, RegisterForm.jsx, EmailVerification.jsx, ForgotPassword.jsx, ResetPassword.jsx, ProtectedRoute.jsx

Common
- SearchBar.jsx, ActivityCard.jsx, BookingCard.jsx, ReviewCard.jsx, RatingStars.jsx, ImageUploader.jsx, DatePicker.jsx, Map.jsx, NotificationBell.jsx, MessageModal.jsx

Tourist
- TouristDashboard.jsx, SearchResults.jsx, ActivityDetails.jsx
- BookingFlow/: SelectDateTime.jsx, SelectExtras.jsx, PersonalDetails.jsx, PaymentForm.jsx, BookingConfirmation.jsx
- MyBookings.jsx, ReviewForm.jsx, AIAssistant.jsx

Farmer
- FarmerDashboard.jsx, FarmRegistration.jsx, ActivityCreation.jsx, ManageActivities.jsx, BookingRequests.jsx, FarmerCalendar.jsx, EarningsReport.jsx

Service Provider
- GuideDashboard.jsx, GuideRegistration.jsx, TransportDashboard.jsx, TransportRegistration.jsx, ServiceRequests.jsx, AvailabilityCalendar.jsx, EarningsOverview.jsx

Admin
- AdminDashboard.jsx, UserManagement.jsx, VerificationQueue.jsx, ReviewModeration.jsx, FeedbackManagement.jsx, ReportsGenerator.jsx, PayoutManagement.jsx, CategoryTagManager.jsx

Static Pages
- HowItWorks.jsx, AboutUs.jsx, TermsAndConditions.jsx, PrivacyPolicy.jsx, FAQ.jsx, ContactUs.jsx

Multi-Step Forms
- FarmRegistrationWizard/: Step1BasicInfo.jsx, Step2FarmDetails.jsx, Step3Activities.jsx, Step4Gallery.jsx, Step5Review.jsx
- ProgressIndicator.jsx, StepNavigation.jsx
- Progress Components: StepProgressBar.jsx, StepIndicator.jsx, FormProgress.jsx (states: completed/current/upcoming; clickable back navigation)

### State Management (React Context)
- AuthContext, UserProfileContext, BookingCartContext, NotificationContext, ThemeContext
- Local state for forms, toggles, loading, and error messages

### SEO & Analytics
- Meta tags, sitemap.xml, robots.txt, Schema.org, Open Graph, Twitter cards, canonical URLs
- GA4 integration, event + conversion tracking, A/B testing hooks

### Performance
- Code splitting with React.lazy
- Image lazy loading
- Memoization (useMemo/useCallback)
- Virtualized lists for long content
- Service worker caching

### Accessibility & UX
- Keyboard navigation, ARIA labels, color contrast
- Alt text for images, focus management
- Touch-friendly controls, swipeable galleries

## Testing
- Unit tests: utilities, validators, controllers, React component logic
- Integration tests: API chains, DB operations
- E2E tests: registration->booking, payment processing, provider workflows
- Test environment: dev seeds (admin only), Stripe sandbox, local uploads, console SMTP, disabled rate limits, verbose errors

## Error Handling
- Backend: try/catch around async, centralized error middleware, structured logs, user-friendly messages with error codes
- Frontend: error boundaries, toast notifications, retries with backoff, fallback UIs

## Deployment & Operations
- Separate builds prod/dev; minification, source maps (restricted in prod)
- Environment-specific configs
- Backup & DR: daily 2AM, weekly full, monthly archive, replication, PITR (30 days), monthly restore tests; RTO 4h, RPO 1h
- Cron jobs (see schedule)
- Observability: metrics, tracing, dashboards

## Cron Jobs Schedule
- Every 5 min: broadcast timeouts checks, auto-refunds if needed
- Hourly: clean expired tokens
- Daily 2 AM: daily reports
- Daily 3 AM: DB backup
- Daily 6 AM: booking reminders
- Weekly Sunday: calculate payouts
- Weekly Monday: send earnings summary
- Monthly 1st: generate invoices
- Monthly: clean old logs
- Every 30 min: sync exchange rates

## WebSocket Events
- booking:new, booking:status
- message:typing, message:new
- service:broadcast, service:accepted, service:timeout
- payment:confirmation
- notification:new
- user:online, user:offline

## Documentation & Manuals
- User Manuals (PDF): Farmer (Si/Ta/En), Tourist (En), Service Provider (Si/Ta/En), Admin (En)
- Include screenshots, step-by-step guides, video links, troubleshooting

## Public Statistics (Frontend)
- Active farms, completed bookings, average rating, destinations map, seasonal trends, success stories, environmental metrics, community contributions

## API Export Formats
- CSV (headers), Excel (formatted), PDF (branding), JSON (backup)

## Implementation Notes
- No dummy data in production; only admin seed in development
- Consistency across CRUD; RESTful conventions
- Robust validation on both backend and frontend
- Transactions and idempotency for bookings/payments
- WebSockets for real-time features
- Reusable components (DRY)
- Comprehensive loading states and user feedback

## Environment Configuration (Appendix)
See `.env.example` for all variables including:
- Email templates (EMAIL_TEMPLATE_PATH, EMAIL_FROM_NAME, EMAIL_REPLY_TO)
- Session (SESSION_SECRET, SESSION_TIMEOUT_MINUTES, REMEMBER_ME_DURATION_DAYS)
- File upload (MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES, IMAGE_COMPRESSION_QUALITY)
- Broadcasting (BROADCAST_RADIUS_KM, BROADCAST_TIMEOUT_MINUTES)
- Commission (PLATFORM_COMMISSION_PERCENTAGE, PAYMENT_GATEWAY_FEE_PERCENTAGE, PAYMENT_GATEWAY_FEE_FIXED)
- Pagination (DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
- Rate limiting (RATE_LIMIT_WINDOW_MINUTES, RATE_LIMIT_MAX_REQUESTS)
- CDN (CDN_URL, CDN_API_KEY)
- Timezone (DEFAULT_TIMEZONE)
- Currency (DEFAULT_CURRENCY, SUPPORTED_CURRENCIES)
- Cancellation policy (CANCELLATION_FULL_REFUND_HOURS, CANCELLATION_PARTIAL_REFUND_HOURS, CANCELLATION_PARTIAL_REFUND_PERCENTAGE)

---
This specification integrates all missing components and establishes a production-ready blueprint for implementation across backend, frontend, real-time services, payments, AI, analytics, and operations.
