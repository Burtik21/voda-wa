const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Registrace firmy
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO companies (name, email, password_hash) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('❌ Chyba při registraci:', err);
            return res.status(500).json({ message: '❌ Chyba serveru' });
        }
        res.status(201).json({ message: '✅ Firma byla úspěšně zaregistrována' });
    });
};

// Přihlášení firmy
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '❌ Zadejte e-mail a heslo!' });
    }

    const sql = 'SELECT * FROM companies WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo!' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo!' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: '✅ Přihlášení úspěšné',
            token
        });
    });
};
