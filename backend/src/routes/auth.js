const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Kayıt
router.post('/register', authController.register);
// Giriş
router.post('/login', authController.login);
// Profil (korumalı)
router.get('/me', authMiddleware, authController.getProfile);
// Admin için kullanıcı listeleme (korumalı)
router.get('/admin/users', authMiddleware, authController.listUsers);
// Şifremi unuttum
router.post('/forgot-password', authController.forgotPassword);
// Şifre sıfırlama
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router; 