// Run with: npm run seed
// Populates the database with demo food items and a demo admin account.
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const connectDB = require('../config/db');
const Food = require('../models/Food');
const User = require('../models/User');
const mongoose = require('mongoose');

const foods = [
  { name: 'Classic Cheese Burger', description: 'Juicy patty with melted cheese, lettuce & tomato', price: 149, category: 'Burgers', foodType: 'non-veg', popular: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format' },
  { name: 'Veg Delight Burger', description: 'Crispy veg patty with fresh salad & mayo', price: 99, category: 'Burgers', foodType: 'veg', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=600&fit=crop&auto=format' },
  { name: 'Margherita Pizza', description: 'Classic cheese & tomato pizza, 8 inch', price: 199, category: 'Pizza', foodType: 'veg', popular: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&auto=format' },
  { name: 'Chicken Pepperoni Pizza', description: 'Loaded with pepperoni & mozzarella cheese', price: 289, category: 'Pizza', foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop&auto=format' },
  { name: 'Chicken Biriyani', description: 'Fragrant basmati rice cooked with spiced chicken', price: 180, category: 'Rice', foodType: 'non-veg', popular: true, todaysSpecial: true, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop&auto=format' },
  { name: 'Veg Fried Rice', description: 'Wok-tossed rice with fresh vegetables', price: 120, category: 'Rice', foodType: 'veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&auto=format' },
  { name: 'Chicken 65', description: 'Spicy deep-fried chicken bites', price: 150, category: 'Chicken', foodType: 'non-veg', popular: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&auto=format' },
  { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 220, category: 'Chicken', foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&auto=format' },
  { name: 'French Fries', description: 'Crispy golden fries with a pinch of salt', price: 89, category: 'Snacks', foodType: 'veg', popular: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&auto=format' },
  { name: 'Paneer Roll', description: 'Spiced paneer wrapped in soft flatbread', price: 110, category: 'Snacks', foodType: 'veg', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&h=600&fit=crop&auto=format' },
  { name: 'Cold Coffee', description: 'Chilled coffee blended with ice cream', price: 90, category: 'Drinks', foodType: 'veg', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&auto=format' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda, sweet or salted', price: 60, category: 'Drinks', foodType: 'veg', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=600&fit=crop&auto=format' },
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie with chocolate sauce', price: 99, category: 'Desserts', foodType: 'veg', todaysSpecial: true, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&h=600&fit=crop&auto=format' },
  { name: 'Gulab Jamun (2 pcs)', description: 'Soft milk dumplings soaked in sugar syrup', price: 70, category: 'Desserts', foodType: 'veg', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&auto=format' },
];

const seed = async () => {
  await connectDB();

  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`Seeded ${foods.length} food items.`);

  const adminEmail = 'admin@restaurant.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Restaurant Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Created demo admin account:');
    console.log('  Email: admin@restaurant.com');
    console.log('  Password: admin123');
  } else {
    console.log('Demo admin account already exists.');
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
