const FOOD_IMAGES = {
  'Classic Cheese Burger':
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format',
  'Veg Delight Burger':
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=600&fit=crop&auto=format',
  'Margherita Pizza':
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&auto=format',
  'Chicken Pepperoni Pizza':
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop&auto=format',
  'Chicken Biriyani':
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop&auto=format',
  'Veg Fried Rice':
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&auto=format',
  'Chicken 65':
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop&auto=format',
  'Butter Chicken':
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&auto=format',
  'French Fries':
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&auto=format',
  'Paneer Roll':
    'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&h=600&fit=crop&auto=format',
  'Cold Coffee':
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&auto=format',
  'Fresh Lime Soda':
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=600&fit=crop&auto=format',
  'Chocolate Brownie':
    'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&h=600&fit=crop&auto=format',
  'Gulab Jamun (2 pcs)':
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&auto=format',
};

export const getFoodImage = (food) =>
  food?.image?.trim() || FOOD_IMAGES[food?.name] ||
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&auto=format';

export default FOOD_IMAGES;
