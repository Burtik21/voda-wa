const db = require('../config/db');
const { Parser } = require('json2csv');

// 📥 Stažení přehledu
exports.downloadReport = (req, res) => {
    const { property_id } = req.params;
    const { format } = req.query;  // JSON nebo CSV
    const userId = req.user.id;

    if (!format || !['json', 'csv'].includes(format)) {
        return res.status(400).json({ message: '❌ Neplatný formát. Použijte \"json\" nebo \"csv\".' });
    }

    // Získání údajů o měřidlech a odečtech
    const sql = `
        SELECT m.id AS meter_id, m.type, m.serial_number, r.value, r.reading_date
        FROM meters m
        LEFT JOIN readings r ON m.id = r.meter_id
        WHERE m.property_id = ?
    `;

    db.query(sql, [property_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při generování přehledu.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '❌ Nebyly nalezeny žádné údaje pro danou nemovitost.' });
        }

        if (format === 'json') {
            res.setHeader('Content-Disposition', 'attachment; filename=report.json');
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(results);
        } else if (format === 'csv') {
            const fields = ['meter_id', 'type', 'serial_number', 'value', 'reading_date'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(results);

            res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
            res.setHeader('Content-Type', 'text/csv');
            return res.status(200).end(csv);
        }
    });
};
