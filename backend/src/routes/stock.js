const express = require('express');
const router = express.Router();
const {
  getStockItems,
  getStockItem,
  createStockItem,
  updateStockItem,
  updateStock,
  deleteStockItem,
  getCriticalStock,
  getStockCategories,
  checkMenuAvailability
} = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const { employee, admin } = require('../middleware/roleMiddleware');

// Tüm route'lar için auth gerekli
router.use(protect);

// GET /api/stock - Stok öğelerini getir (employee ve admin)
router.get('/', employee, getStockItems);

// GET /api/stock/categories - Stok kategorilerini getir (employee ve admin)
router.get('/categories', employee, getStockCategories);

// GET /api/stock/critical - Kritik stok seviyesindeki öğeleri getir (employee ve admin)
router.get('/critical', employee, getCriticalStock);

// GET /api/stock/menu-availability - Menü öğelerinin uygunluk durumunu kontrol et (employee ve admin)
router.get('/menu-availability', employee, checkMenuAvailability);

// GET /api/stock/:id - Tekil stok öğesi getir (employee ve admin)
router.get('/:id', employee, getStockItem);

// POST /api/stock - Yeni stok öğesi oluştur (employee ve admin)
router.post('/', employee, createStockItem);

// PUT /api/stock/:id - Stok öğesi güncelle (employee ve admin)
router.put('/:id', employee, updateStockItem);

// PATCH /api/stock/:id/update - Stok girişi/çıkışı (employee ve admin)
router.patch('/:id/update', employee, updateStock);

// DELETE /api/stock/:id - Stok öğesi sil (sadece admin)
router.delete('/:id', admin, deleteStockItem);

module.exports = router; 