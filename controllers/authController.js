const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Přihlášení firmy
exports.loginFirm = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '❌ Zadejte e-mail a heslo.' });
    }

    const sql = 'SELECT * FROM companies WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba serveru.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: 'firm' }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: '✅ Přihlášení firmy bylo úspěšné', token });
    });
};

// Přihlášení zákazníka
exports.loginCustomer = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '❌ Zadejte e-mail a heslo.' });
    }

    const sql = 'SELECT * FROM customers WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba serveru.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: '❌ Neplatný e-mail nebo heslo.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: 'customer' }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: '✅ Přihlášení zákazníka bylo úspěšné', token });
    });
};

// Registrace firmy
exports.register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při hashování hesla.' });
        }

        const sql = 'INSERT INTO companies (name, email, password_hash) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při registraci firmy.' });
            }

            res.status(201).json({ message: '✅ Firma byla úspěšně zaregistrována' });
        });
    });
};

// Odhlášení uživatele (firma/zákazník)
exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: '❌ Chybí token pro odhlášení.' });
    }

    // Uložení tokenu do blacklistu
    const sql = 'INSERT INTO token_blacklist (token) VALUES (?)';
    db.query(sql, [token], (err, result) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při odhlašování.', error: err });
        }

        res.status(200).json({ message: '✅ Úspěšné odhlášení.' });
    });
};

