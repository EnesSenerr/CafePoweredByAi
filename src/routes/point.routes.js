const express = require('express');
const router = express.Router();
const { earnPoints, redeemPoints, getPointHistory } = require('../controllers/pointController');

// Puan kazanım endpoint'i
router.post('/earn', earnPoints);

// Puan kullanım (ödül alma) endpoint'i
router.post('/redeem', redeemPoints);

// Kullanıcının puan işlem geçmişini getir
router.get('/history/:userId', getPointHistory);

module.exports = router; 