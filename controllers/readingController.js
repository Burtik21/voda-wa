const db = require('../config/db');

// Přidání odečtu
exports.addReading = (req, res) => {
    const { value, reading_date } = req.body;
    const customerId = req.user.id; // ID zákazníka z JWT

    if (!value || !reading_date) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    // Získání meter_id na základě zákazníka
    const meterSql = `
        SELECT m.id FROM meters m
        JOIN properties p ON m.property_id = p.id
        WHERE p.customer_id = ? LIMIT 1
    `;

    db.query(meterSql, [customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při získávání měřidla.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '❌ Žádné měřidlo nebylo nalezeno.' });
        }

        const meterId = results[0].id;

        // Vložení odečtu
        const insertSql = 'INSERT INTO readings (meter_id, value, reading_date) VALUES (?, ?, ?)';
        db.query(insertSql, [meterId, value, reading_date], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při přidávání odečtu.', error: err });
            }

            res.status(201).json({ message: '✅ Odečet byl úspěšně přidán.', reading_id: result.insertId });
        });
    });
};

// Úprava odečtu
exports.editReading = (req, res) => {
    const { reading_id, value, reading_date } = req.body;
    const customerId = req.user.id; // ID zákazníka z JWT

    if (!reading_id || !value || !reading_date) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    // Ověření, že odečet patří zákazníkovi
    const verifySql = `
        SELECT r.id FROM readings r
        JOIN meters m ON r.meter_id = m.id
        JOIN properties p ON m.property_id = p.id
        WHERE r.id = ? AND p.customer_id = ?
    `;

    db.query(verifySql, [reading_id, customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při ověřování odečtu.', error: err });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: '❌ Nemáte oprávnění upravovat tento odečet.' });
        }

        // Úprava odečtu
        const updateSql = 'UPDATE readings SET value = ?, reading_date = ? WHERE id = ?';
        db.query(updateSql, [value, reading_date, reading_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při úpravě odečtu.', error: err });
            }

            res.status(200).json({ message: '✅ Odečet byl úspěšně upraven.' });
        });
    });
};
