const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { askGeminiBarista } = require('../controllers/chatbotController');

// Kafe temalı AI Barista chatbot
router.post('/gemini', askGeminiBarista);

module.exports = router; 