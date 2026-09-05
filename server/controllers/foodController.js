const Food = require('../models/Food');

// GET /api/foods  (supports ?category=Pizza & ?search=biriyani)
const getFoods = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const foods = await Food.find(query).sort({ createdAt: -1 });
    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load food items. Please try again.' });
  }
};

// GET /api/foods/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }
    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// POST /api/foods  (admin only)
const createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not add food item. Please check the details.' });
  }
};

// PUT /api/foods/:id  (admin only)
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }
    res.json({ success: true, food });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not update food item. Please check the details.' });
  }
};

// DELETE /api/foods/:id  (admin only)
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }
    res.json({ success: true, message: 'Food item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
