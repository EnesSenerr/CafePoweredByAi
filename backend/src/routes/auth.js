const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

// Profil resimleri için upload klasörünü oluştur
const uploadsDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer konfigürasyonu - profil resimleri için
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Dosya adı: user-id_timestamp.uzantı
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `user-${req.user.id}_${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Sadece resim dosyalarına izin ver
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Kayıt
router.post('/register', authController.register);
// Giriş
router.post('/login', authController.login);
// Profil (korumalı)
router.get('/me', protect, authController.getProfile);

// Profil güncelleme (korumalı)
router.put('/update-profile', protect, authController.updateProfile);
// Profil resmi yükleme (korumalı)
router.post('/upload-profile-image', protect, upload.single('profileImage'), authController.uploadProfileImage);
// Şifre değiştirme (korumalı)
router.post('/change-password', protect, authController.changePassword);

// Admin için kullanıcı yönetimi (korumalı)
router.get('/admin/users', protect, admin, authController.listUsers);
router.post('/admin/users', protect, admin, authController.createUser);
router.put('/admin/users/:id', protect, admin, authController.updateUser);
router.delete('/admin/users/:id', protect, admin, authController.deleteUser);
router.patch('/admin/users/:id/toggle', protect, admin, authController.toggleUserStatus);

// Şifremi unuttum
router.post('/forgot-password', authController.forgotPassword);
// Şifre sıfırlama
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router; 