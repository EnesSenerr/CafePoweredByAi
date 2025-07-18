const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  updateStock,
  getCategories
} = require('../controllers/menuController');

const { protect } = require('../middleware/authMiddleware');
const { requireAnyRole } = require('../middleware/roleMiddleware');

// Public routes (müşteriler için)
router.get('/', getAllMenuItems); // Tüm menü öğelerini getir
router.get('/categories', getCategories); // Kategorileri getir
router.get('/:id', getMenuItem); // Tek menü öğesi getir

// Protected routes - Employee ve Admin erişimi (Auth middleware her endpoint'e ayrı ayrı ekleniyor)
router.post('/', protect, requireAnyRole(['employee', 'admin']), createMenuItem); // Yeni menü öğesi oluştur
router.put('/:id', protect, requireAnyRole(['employee', 'admin']), updateMenuItem); // Menü öğesi güncelle
router.patch('/:id/toggle', protect, requireAnyRole(['employee', 'admin']), toggleMenuItemAvailability); // Durum değiştir
router.patch('/:id/stock', protect, requireAnyRole(['employee', 'admin']), updateStock); // Stok güncelle

// Admin only routes
router.delete('/:id', protect, requireAnyRole(['admin']), deleteMenuItem); // Menü öğesi sil

module.exports = router; 