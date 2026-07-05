const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mst-farzana.github.io',
  'https://web-app-production.up.railway.app',
  'https://shopease-production.up.railway.app',
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 5. ✅ Static files with open CORS for images
app.use(
  '/images',
  (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    }
    next();
  },
  express.static(path.join(__dirname, 'public/images'))
);

app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // ✅ Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// ======= Routes =======
app.use('/api/admin', require('./routes/adminRoutes'));
try {
  app.use('/api/users', require('./routes/userRoutes'));

  app.use('/api/discounts', require('./routes/discountRoutes'));
  app.use('/api/categoryItems', require('./routes/categoryItemRoutes'));
  app.use('/api/orders', require('./routes/orderRoutes'));
  app.use('/api/mail', require('./routes/mailRoutes'));
  app.use('/api/contact', require('./routes/contactRoutes'));
} catch (err) {
  console.error('❌ Route error:', err.message);
}

// ======= Base Routes =======
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => res.send('OK'));

// ======= 404 Not Found =======
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// ======= Error Handler =======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ======= Start Server =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
