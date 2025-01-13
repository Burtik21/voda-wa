const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '❌ Přístup odepřen! Token chybí.' });
    }

    // Ověření, zda není token v blacklistu
    const sql = 'SELECT * FROM token_blacklist WHERE token = ?';
    db.query(sql, [token], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při ověřování tokenu.' });
        }

        if (results.length > 0) {
            return res.status(403).json({ message: '❌ Tento token byl již zneplatněn.' });
        }

        // Ověření platnosti tokenu
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: '❌ Token je neplatný nebo vypršel.' });
            }

            req.user = user;
            next();
        });
    });
};
exports.verifyCompanyRole = (req, res, next) => {
    if (req.user.role !== 'firm') {
        return res.status(403).json({ message: '❌ Přístup pouze pro firmy.' });
    }
    next();
};

module.exports = authenticateToken;
