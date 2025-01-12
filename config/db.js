const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Chyba při připojení k databázi:', err);
        return;
    }
    console.log('✅ Připojeno k databázi');
});

module.exports = db;
