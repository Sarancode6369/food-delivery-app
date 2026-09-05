// Generates a friendly order id like ORD-20260903-001
const Order = require('../models/Order');

const generateOrderId = async () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const datePart = `${y}${m}${d}`;

  const startOfDay = new Date(y, now.getMonth(), now.getDate());
  const endOfDay = new Date(y, now.getMonth(), now.getDate() + 1);

  const countToday = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  const sequence = String(countToday + 1).padStart(3, '0');
  return `ORD-${datePart}-${sequence}`;
};

module.exports = generateOrderId;
