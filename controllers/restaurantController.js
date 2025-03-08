const bcrypt = require('bcrypt');
const Restaurant = require('../models/Restaurant'); // Assuming you have a Restaurant model

const menus = {
  1: [
    { id: 1, name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken pieces." },
    { id: 2, name: "Paneer Tikka", description: "Grilled paneer cubes marinated in traditional spices." },
    { id: 3, name: "Biryani", description: "Aromatic rice dish layered with spiced meat or vegetables." },
    { id: 4, name: "Pizza", description: "Classic Italian pizza with a crispy crust and fresh toppings." },
  ],
  2: [
    { id: 1, name: "Chicken Curry", description: "Spicy chicken curry with a rich, flavorful sauce." },
    { id: 2, name: "Vegetable Samosa", description: "Crispy pastry filled with spiced vegetables." },
    { id: 3, name: "Naan", description: "Soft and fluffy Indian bread." },
    { id: 4, name: "Burger", description: "Juicy beef burger with lettuce, tomato, and cheese." },
  ],
  // Add more menus for other restaurants
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found. Please check your email or register" });
    }

    const isPasswordValid = await bcrypt.compare(password, restaurant.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password. Please try again" });
    }

    res.json({ message: "Login Successful" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred during login", error: err.message });
  }
};

const register = async (req, res) => {
  const { restaurantName, ownerName, address, contact, cuisine, email, password, confirmPassword } = req.body;

  if (!restaurantName || !ownerName || !address || !contact || !cuisine || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newRestaurant = new Restaurant({
      restaurantName,
      ownerName,
      address,
      contact,
      cuisine,
      email,
      password: hashPassword,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred during registration", error: err.message });
  }
};

const getMenu = (req, res) => {
  const { id } = req.params;
  const menu = menus[id] || [];
  res.json(menu);
};

module.exports = {
  login,
  register,
  getMenu,
};