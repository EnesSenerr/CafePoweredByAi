const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API yolları
app.get('/', (req, res) => {
  res.json({
    message: 'Cafe Sadakat Sistemi API',
    status: 'active',
    timestamp: new Date()
  });
});

// Auth middleware'i import et
const authMiddleware = require('./middleware/authMiddleware');

// API yolları
app.use('/api/auth', require('./routes/auth'));

// Point API'leri - JWT korumalı
app.use('/api/points', authMiddleware, require('../../src/routes/point.routes'));

// Reward API'leri - GET request'ler herkese açık, POST/PUT/DELETE korumalı
app.use('/api/rewards', require('../../src/routes/reward.routes'));

// Admin API'leri - JWT korumalı
app.use('/api/admin', authMiddleware, require('../../src/routes/admin.routes'));

// Port ayarı
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-loyalty-system')
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    // Uygulamayı başlat
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sunucu ${PORT} numaralı portta çalışıyor`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Network: http://10.196.3.101:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  }); 