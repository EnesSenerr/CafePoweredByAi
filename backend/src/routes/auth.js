const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

// Kayıt
router.post('/register', authController.register);
// Giriş
router.post('/login', authController.login);
// Profil (korumalı)
router.get('/me', protect, authController.getProfile);

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