const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const fs = require('fs');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root path için route
app.get('/', (req, res) => {
  res.json({ message: 'RentaCar API çalışıyor' });
});

// Uploads klasörünü ve varsayılan dosyaları statik olarak servis et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/default-logo.svg', express.static(path.join(__dirname, 'public', 'default-logo.svg')));

// Uploads klasörünü oluştur (eğer yoksa)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Public klasörünü oluştur ve varsayılan logoyu kopyala (eğer yoksa)
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  // Frontend'deki varsayılan logoyu backend'e kopyala
  const defaultLogoSource = path.join(__dirname, '..', 'frontend', 'public', 'default-logo.svg');
  const defaultLogoTarget = path.join(publicDir, 'default-logo.svg');
  if (fs.existsSync(defaultLogoSource)) {
    fs.copyFileSync(defaultLogoSource, defaultLogoTarget);
  }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ratings', ratingRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT); 