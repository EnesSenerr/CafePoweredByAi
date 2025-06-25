const express = require('express');
const router = express.Router();
const { getAllRewards, getReward } = require('../../../src/controllers/rewardController');

// Tüm ödülleri listele (kullanıcı tarafı)
router.get('/', getAllRewards);

// Belirli bir ödülün detaylarını getir
router.get('/:id', getReward);

module.exports = router; 