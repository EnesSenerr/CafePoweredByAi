const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCollaborativeRecommendations } = require('../controllers/recommendationController');

// Kişiselleştirilmiş öneriler (collaborative filtering)
router.get('/collaborative', protect, getCollaborativeRecommendations);

module.exports = router; 