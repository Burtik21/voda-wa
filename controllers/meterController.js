const db = require('../config/db');

exports.addMeter = (req, res) => {
    const { type, serial_number } = req.body;
    const customerId = req.user.id; // ID zákazníka z JWT

    if (!type || !serial_number) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    // Získání property_id zákazníka
    const propertySql = 'SELECT id FROM properties WHERE customer_id = ? LIMIT 1';
    db.query(propertySql, [customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při získávání nemovitosti.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '❌ Zákazník nemá přiřazenou žádnou nemovitost.' });
        }

        const propertyId = results[0].id;

        // Vložení měřidla s automatickým property_id
        const insertSql = 'INSERT INTO meters (property_id, type, serial_number) VALUES (?, ?, ?)';
        db.query(insertSql, [propertyId, type, serial_number], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při přidávání měřidla.', error: err });
            }

            res.status(201).json({ message: '✅ Měřidlo bylo úspěšně přidáno.', meter_id: result.insertId });
        });
    });
};

// Úprava měřidla s automatickým ověřením vlastnictví
exports.editMeter = (req, res) => {
    const { meter_id, type, serial_number } = req.body;
    const customerId = req.user.id; // ID zákazníka z JWT

    if (!meter_id || !type || !serial_number) {
        return res.status(400).json({ message: '❌ Všechna pole jsou povinná!' });
    }

    // Ověření, že měřidlo patří zákazníkovi
    const verifySql = `SELECT m.id FROM meters m JOIN properties p ON m.property_id = p.id WHERE m.id = ? AND p.customer_id = ?`;
    db.query(verifySql, [meter_id, customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při ověřování měřidla.', error: err });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: '❌ Nemáte oprávnění upravovat toto měřidlo.' });
        }

        // Úprava měřidla
        const updateSql = 'UPDATE meters SET type = ?, serial_number = ? WHERE id = ?';
        db.query(updateSql, [type, serial_number, meter_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při úpravě měřidla.', error: err });
            }

            res.status(200).json({ message: '✅ Měřidlo bylo úspěšně upraveno.' });
        });
    });
};