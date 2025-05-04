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

// API yolları burada eklenecek
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users', require('./routes/user.routes'));
// app.use('/api/points', require('./routes/point.routes'));
// app.use('/api/rewards', require('./routes/reward.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));

// Port ayarı
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-loyalty-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    // Uygulamayı başlat
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} numaralı portta çalışıyor`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  }); 