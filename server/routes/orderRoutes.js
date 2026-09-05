const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', createOrder);
router.get('/stats/summary', protect, adminOnly, getOrderStats);
router.get('/:id', getOrderById);
router.get('/', protect, adminOnly, getOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
