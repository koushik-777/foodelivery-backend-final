const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - make sure these are in the right order
app.use(cors());

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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

