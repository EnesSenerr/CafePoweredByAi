const express = require('express');
const router = express.Router();
const { 
  adminGetAllRewards, 
  createReward, 
  updateReward, 
  deleteReward 
} = require('../../../src/controllers/rewardController');

// Ödül yönetimi routes
router.get('/rewards', adminGetAllRewards);
router.post('/rewards', createReward);
router.put('/rewards/:id', updateReward);
router.delete('/rewards/:id', deleteReward);

module.exports = router; 