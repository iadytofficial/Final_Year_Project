const path = require('path');
// Load root .env then local .env (root preferred for monorepo setups)
try { require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); } catch (e) {}
require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const pino = require('pino');
const pinoHttp = require('pino-http');
const path = require('path');
const { connectMongo } = require('./config/mongo');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const activityRoutes = require('./routes/activities');
const searchRoutes = require('./routes/search');
const bookingRoutes = require('./routes/bookings');
const { scheduleJobs } = require('./services/cron');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const imageRoutes = require('./routes/images');
const calendarRoutes = require('./routes/calendar');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const publicRoutes = require('./routes/public');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL?.split(',') || '*', credentials: true },
});
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join', (room) => socket.join(room));
  socket.on('typing', (data) => socket.to(data.room).emit('typing', { userId: data.userId }));
  socket.on('disconnect', () => {});
});
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());
// Static hosting for uploads (guarded by file path)
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), { fallthrough: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(pinoHttp({ logger }));

// Rate limit
const apiLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1', 10)) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/ai', aiRoutes);

// 404 and errors
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 4000;
connectMongo()
  .then(() => {
    scheduleJobs();
    server.listen(port, () => {
      logger.info({ port }, 'AgroLK server running');
    });
  })
  .catch((err) => {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  });
