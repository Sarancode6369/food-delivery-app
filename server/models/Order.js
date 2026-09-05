const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    deliveryType: { type: String, enum: ['Home Delivery', 'Takeaway'], default: 'Home Delivery' },
    paymentMethod: { type: String, enum: ['Cash on Delivery', 'UPI'], default: 'Cash on Delivery' },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
