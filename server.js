const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - make sure these are in the right order
app.use(cors({
  origin: '*',  // In development; tighten this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Error handler for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      message: "Invalid JSON format", 
      error: err.message 
    });
  }
  next(err);
});

// Parse JSON bodies first
app.use(express.json());

// Then log the parsed body
app.use((req, res, next) => {
    console.log('Incoming Request Body:', req.body);
    next();
});

app.get('/', (req, res) => {
    res.send('<h2>Hello World!</h2>');
});

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/restaurants', restaurantRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

module.exports = app;
