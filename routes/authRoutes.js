const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpointy
router.post('/register', authController.register);
router.post('/login-firm', authController.loginFirm);
router.post('/login-customer', authController.loginCustomer);
router.post('/logout', authController.logout);

module.exports = router;
