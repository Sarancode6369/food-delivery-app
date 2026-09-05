const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Burgers', 'Pizza', 'Chicken', 'Rice', 'Drinks', 'Snacks', 'Desserts'],
    },
    image: { type: String, default: '' },
    foodType: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
    available: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    todaysSpecial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
