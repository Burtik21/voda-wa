const express = require('express');
const router = express.Router();
const firmController = require('../controllers/firmController');
const authenticateToken = require('../middleware/authMiddleware');  // Import middleware

// 🛡️ Chráněný endpoint na přidání zákazníka
router.post('/add-customer', authenticateToken, firmController.addCustomerWithProperty);
router.delete('/delete-customer', authenticateToken, firmController.deleteCustomerByEmail);


module.exports = router;
