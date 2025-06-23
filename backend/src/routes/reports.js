const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getInventoryReport,
  downloadReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { employee, admin } = require('../middleware/roleMiddleware');

// Tüm route'lar için auth gerekli
router.use(protect);

// GET /api/reports/sales - Satış raporu (employee ve admin)
router.get('/sales', employee, getSalesReport);

// GET /api/reports/inventory - Envanter raporu (employee ve admin)
router.get('/inventory', employee, getInventoryReport);

// GET /api/reports/:reportType/download - Rapor indirme (employee ve admin)
router.get('/:reportType/download', employee, downloadReport);

module.exports = router; 