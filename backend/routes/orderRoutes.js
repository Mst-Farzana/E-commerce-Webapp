const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController'); // Import is correct

router.post('/', createOrder);
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
