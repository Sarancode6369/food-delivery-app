const Order = require('../models/Order');
const Food = require('../models/Food');
const generateOrderId = require('../utils/generateOrderId');
const { notifyAdminNewOrder, buildWhatsAppLink, buildCustomerUpdateMessage } = require('../services/whatsappService');

const DELIVERY_CHARGE = 30;

// POST /api/orders  (customer places an order - no login required)
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      address,
      landmark,
      deliveryType,
      paymentMethod,
      items,
    } = req.body;

    // Friendly validation messages, never raw technical errors
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number.' });
    }
    if (deliveryType !== 'Takeaway' && (!address || !address.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter your delivery address.' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Re-check food availability & pricing from the database (never trust client prices)
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food || !food.available) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${item.name || 'an item'}" is currently unavailable.`,
        });
      }
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      orderItems.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });
      subtotal += food.price * quantity;
    }

    const deliveryCharge = deliveryType === 'Takeaway' ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;
    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: (address || '').trim(),
      landmark: (landmark || '').trim(),
      deliveryType: deliveryType === 'Takeaway' ? 'Takeaway' : 'Home Delivery',
      paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'Cash on Delivery',
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
      status: 'Pending',
    });

    // Send / prepare the WhatsApp notification to the restaurant admin
    const whatsapp = await notifyAdminNewOrder(order);

    res.status(201).json({
      success: true,
      order,
      whatsapp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// GET /api/orders/:id  (lookup by Mongo _id OR by human-friendly orderId)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = (await Order.findById(id).catch(() => null)) || (await Order.findOne({ orderId: id }));
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// GET /api/orders  (admin only - list all orders, optional ?status=Pending)
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// PUT /api/orders/:id/status  (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const statusMessages = {
      Confirmed: 'has been confirmed. Your food is being prepared.',
      Preparing: 'is being prepared.',
      'Out for Delivery': 'is out for delivery!',
      Delivered: 'has been delivered. Enjoy your meal!',
      Cancelled: 'has been cancelled.',
      Pending: 'has been received.',
    };

    const customerMessage = buildCustomerUpdateMessage(order, statusMessages[status] || 'has been updated.');
    const whatsappLink = buildWhatsAppLink(order.customerPhone, customerMessage);

    res.json({ success: true, order, whatsappLink });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// GET /api/orders/stats/summary  (admin dashboard numbers)
const getOrderStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalOrders, todaysOrders, pending, preparing, outForDelivery, completed, todaysRevenueAgg] =
      await Promise.all([
        Order.countDocuments({}),
        Order.countDocuments({ createdAt: { $gte: startOfDay } }),
        Order.countDocuments({ status: 'Pending' }),
        Order.countDocuments({ status: 'Preparing' }),
        Order.countDocuments({ status: 'Out for Delivery' }),
        Order.countDocuments({ status: 'Delivered' }),
        Order.aggregate([
          { $match: { createdAt: { $gte: startOfDay }, status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        todaysOrders,
        pending,
        preparing,
        outForDelivery,
        completed,
        todaysRevenue: todaysRevenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { createOrder, getOrderById, getOrders, updateOrderStatus, getOrderStats };
