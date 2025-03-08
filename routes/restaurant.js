const express = require('express');
const router = express.Router();
const { login, register, getMenu } = require('../controllers/restaurantController');

router.post('/login', login);
router.post('/register', register);
router.get('/menu/:id', getMenu);

module.exports = router;