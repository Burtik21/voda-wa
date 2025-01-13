const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');

// Endpoint pro stažení přehledu
router.get('/download-report/:property_id', authenticateToken, reportController.downloadReport);

module.exports = router;
