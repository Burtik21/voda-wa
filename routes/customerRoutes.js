const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// 🛡️ Chráněný endpoint - jen přihlášené firmy
router.get('/customers', authenticateToken, (req, res) => {
    res.json({
        message: `✅ Přístup povolen pro uživatele ID: ${req.user.id}`,
        user: req.user
    });
});

module.exports = router;
