const mysql = require('mysql2');

// Připojení k databázi
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',  // Tvé heslo
    database: 'voda_api',  // Správná databáze
    port: 3306
});

// Připojení k databázi
connection.connect((err) => {
    if (err) {
        console.error('❌ Chyba při připojení:', err);
        return;
    }
    console.log('✅ Připojeno k databázi!');
});

// Vložení dat do tabulky `companies`
const insertQuery = 'INSERT INTO companies (name) VALUES (?)';
const companyName = 'Company XYZ';  // Správný název firmy

connection.query(insertQuery, [companyName], (err, result) => {
    if (err) {
        console.error('❌ Chyba při vkládání dat:', err);
        return;
    }
    console.log(`✅ Firma byla vložena s ID: ${result.insertId}`);
    connection.end();  // Zavření připojení
});
