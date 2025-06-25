const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:3001',
    'http://192.168.1.102:3000',
    'http://192.168.1.102:3001',
    'http://192.168.1.102:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static dosyalar için middleware - profil resimleri
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API yolları
app.get('/', (req, res) => {
  res.json({
    message: 'Cafe Sadakat Sistemi API',
    status: 'active',
    timestamp: new Date()
  });
});

// Auth middleware'i import et
const { protect } = require('./middleware/authMiddleware');

// API yolları
app.use('/api/auth', require('./routes/auth'));

// Menu API'leri - GET request'ler herkese açık, diğerleri role-based korumalı
app.use('/api/menu', require('./routes/menu'));

// Order API'leri - JWT korumalı
app.use('/api/orders', require('./routes/orders'));

// Stock API'leri - JWT korumalı
app.use('/api/stock', require('./routes/stock'));

// Report API'leri - JWT korumalı
app.use('/api/reports', require('./routes/reports'));

// Point API'leri - JWT korumalı
app.use('/api/points', protect, require('../../src/routes/point.routes'));

// Reward API'leri - GET request'ler herkese açık, POST/PUT/DELETE korumalı
app.use('/api/rewards', require('../../src/routes/reward.routes'));

// Admin API'leri - JWT korumalı
app.use('/api/admin', protect, require('../../src/routes/admin.routes'));

// Port ayarı
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/cafe-loyalty-system?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    // Uygulamayı başlat
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sunucu ${PORT} numaralı portta çalışıyor`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Network: http://192.168.1.102:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  }); 