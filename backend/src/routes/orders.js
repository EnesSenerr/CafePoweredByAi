const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { employee, admin } = require('../middleware/roleMiddleware');

// Tüm route'lar için auth gerekli
router.use(protect);

// POST /api/orders - Yeni sipariş oluştur (employee ve admin)
router.post('/', employee, createOrder);

// GET /api/orders - Siparişleri getir (employee ve admin)
router.get('/', employee, getOrders);

// GET /api/orders/stats - Sipariş istatistikleri (employee ve admin)
router.get('/stats', employee, getOrderStats);

// GET /api/orders/:id - Tekil sipariş getir (employee ve admin)
router.get('/:id', employee, getOrder);

// PATCH /api/orders/:id/status - Sipariş durumunu güncelle (employee ve admin)
router.patch('/:id/status', employee, updateOrderStatus);

// DELETE /api/orders/:id - Sipariş sil (sadece admin)
router.delete('/:id', admin, deleteOrder);

module.exports = router; 