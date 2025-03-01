const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
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

app.post('/register', async(req, res) => {
    console.log('Register endpoint hit');
    console.log('Headers:', req.headers);
    console.log('Raw body:', req.body);
    try {
        const {Email, Password, ConfirmPassword} = req.body;
        
        if (!Email || !Password || !ConfirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        if (Password !== ConfirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }
        
        const hashPassword = await bcrypt.hash(Password, 10);
        const newUser = new User({
            Email,
            Password: hashPassword,
            ConfirmPassword: hashPassword
        });
        
        await newUser.save();
        res.status(201).json({message: "User Created Successfully"});
        console.log("User Created Successfully");
    } catch(err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: "An error occurred during registration",
            error: err.message
        });
    }
});
app.post('/login', async(req, res) => {
    const {Email, Password} = req.body;
    console.log("Login attempt for:", Email);
    
    try {
        const user = await User.findOne({ Email });
        
        if (!user) {
            console.log("User not found");
            return res.status(400).json({
                message: "User not found. Please check your email or register"
            });
        }
        
        // Check if password matches
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        console.log("Password valid:", isPasswordValid);
        
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(400).json({
                message: "Incorrect password. Please try again"
            });
        }
        
        res.json({message: "Login Successful"});
        console.log("Login Successful");
    } catch(err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "An error occurred during login",
            error: err.message
        });
    }
});

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

