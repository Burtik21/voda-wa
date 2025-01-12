const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // Získáme token z Authorization hlavičky
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    // Když token chybí
    if (!token) {
        return res.status(401).json({ message: '❌ Přístup odepřen! Token chybí.' });
    }

    // Ověření platnosti tokenu
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '❌ Token je neplatný nebo vypršel.' });
        }

        req.user = user;  // Přidáme data z tokenu do requestu
        next();           // Pokračujeme na další middleware nebo endpoint
    });
};

module.exports = authenticateToken;
