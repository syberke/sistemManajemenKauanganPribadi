const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
  filterFinance,
  getCategoryStats,
  getMonthlyStats,
  getFinanceReportByPeriod,
} = require('../controllers/financeController');

// ================= ROUTES =================

// CRUD finance
router
  .route('/')
  .get(protect, getFinances)
  .post(protect, createFinance);

router
  .route('/:id')
  .put(protect, updateFinance)
  .delete(protect, deleteFinance);

// Summary & filter
router.get('/summary', protect, getFinanceSummary);
router.get('/filter', protect, filterFinance);

// Statistics
router.get('/category-stats', protect, getCategoryStats);
router.get('/monthly-stats', protect, getMonthlyStats);

// Report
router.get('/report', protect, getFinanceReportByPeriod);

module.exports = router;
