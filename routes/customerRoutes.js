const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');
const readingController = require('../controllers/readingController');
const authenticateToken = require('../middleware/authMiddleware');

// Přidání měřidla
router.post('/add-meter', authenticateToken, meterController.addMeter);
router.post('/edit-meter', authenticateToken, meterController.editMeter);

// Přidání odečtu
router.post('/add-reading', authenticateToken, readingController.addReading);
router.post('/edit-reading', authenticateToken, readingController.editReading);

module.exports = router;
