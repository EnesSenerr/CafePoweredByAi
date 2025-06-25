const express = require('express');
const router = express.Router();
const { earnPoints, redeemPoints, getPointHistory } = require('../../../src/controllers/pointController');

// Puan kazanım endpoint'i
router.post('/earn', earnPoints);

// Puan kullanım (ödül alma) endpoint'i
router.post('/redeem', redeemPoints);

// Kullanıcının puan işlem geçmişini getir (JWT'den kullanıcı ID alınır)
router.get('/history', getPointHistory);

module.exports = router; 