const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { Email, Password, ConfirmPassword } = req.body;

  if (!Email || !Password || !ConfirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (Password !== ConfirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({
      Email,
      Password: hashPassword,
      // Don't store confirmPassword in the database
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "An error occurred during registration", error: err.message });
  }
};

const login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User not found. Please check your email or register" });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password. Please try again" });
    }

    res.json({ message: "Login Successful" });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "An error occurred during login", error: err.message });
  }
};

module.exports = {
  register,
  login
};