const bcrypt = require('bcrypt');
const db = require('../config/db');
const crypto = require('crypto');

// 🔐 Funkce pro generování náhodného hesla
const generatePassword = () => {
    return crypto.randomBytes(8).toString('hex');  // Vytvoří náhodné 16znakové heslo
};

// ✅ Přidání zákazníka a jeho nemovitosti
exports.addCustomerWithProperty = async (req, res) => {
    const { name, email, address } = req.body;
    const companyId = req.user.id;  // ID firmy z JWT tokenu

    // 🔎 Ověření, že jsou všechna potřebná data vyplněná
    if (!name || !email || !address) {
        return res.status(400).json({ message: '❌ Všechna pole (jméno, email, adresa) jsou povinná.' });
    }

    try {
        // 🔐 Generování a hashování hesla
        const generatedPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // 🛠️ Vložení zákazníka do databáze
        const customerSql = 'INSERT INTO customers (company_id, name, email, password_hash) VALUES (?, ?, ?, ?)';
        db.query(customerSql, [companyId, name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při vytváření zákazníka.', error: err });
            }

            const customerId = result.insertId;  // Získání ID nového zákazníka

            // 🏠 Vložení nemovitosti do databáze
            const propertySql = 'INSERT INTO properties (customer_id, address) VALUES (?, ?)';
            db.query(propertySql, [customerId, address], (err2, result2) => {
                if (err2) {
                    return res.status(500).json({ message: '❌ Chyba při vytváření nemovitosti.', error: err2 });
                }

                // ✅ Odpověď s údaji o zákazníkovi a vygenerovaném heslu
                res.status(201).json({
                    message: '✅ Zákazník a jeho nemovitost byly úspěšně vytvořeny.',
                    customer: {
                        id: customerId,
                        name: name,
                        email: email,
                        generatedPassword: generatedPassword,  // Vrátíme vygenerované heslo
                        property: {
                            address: address,
                            created_at: new Date()
                        }
                    }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: '❌ Neočekávaná chyba.', error: error.message });
    }
};
exports.deleteCustomerByEmail = (req, res) => {
    const { email } = req.body;
    const companyId = req.user.id;  // ID přihlášené firmy

    if (!email) {
        return res.status(400).json({ message: '❌ Chybí e-mail zákazníka.' });
    }

    // Ověření, že zákazník existuje a patří firmě
    const verifySql = 'SELECT id FROM customers WHERE email = ? AND company_id = ?';
    db.query(verifySql, [email, companyId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '❌ Chyba při ověřování zákazníka.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '❌ Zákazník neexistuje nebo nepatří vaší firmě.' });
        }

        const customerId = results[0].id;

        // 1️⃣ Smazání odečtů
        const deleteReadingsSql = `
            DELETE r FROM readings r
            JOIN meters m ON r.meter_id = m.id
            JOIN properties p ON m.property_id = p.id
            WHERE p.customer_id = ?
        `;
        db.query(deleteReadingsSql, [customerId], (err) => {
            if (err) {
                return res.status(500).json({ message: '❌ Chyba při mazání odečtů.', error: err });
            }

            // 2️⃣ Smazání měřidel
            const deleteMetersSql = `
                DELETE m FROM meters m
                JOIN properties p ON m.property_id = p.id
                WHERE p.customer_id = ?
            `;
            db.query(deleteMetersSql, [customerId], (err) => {
                if (err) {
                    return res.status(500).json({ message: '❌ Chyba při mazání měřidel.', error: err });
                }

                // 3️⃣ Smazání nemovitostí
                const deletePropertiesSql = 'DELETE FROM properties WHERE customer_id = ?';
                db.query(deletePropertiesSql, [customerId], (err) => {
                    if (err) {
                        return res.status(500).json({ message: '❌ Chyba při mazání nemovitostí.', error: err });
                    }

                    // 4️⃣ Smazání zákazníka
                    const deleteCustomerSql = 'DELETE FROM customers WHERE id = ?';
                    db.query(deleteCustomerSql, [customerId], (err) => {
                        if (err) {
                            return res.status(500).json({ message: '❌ Chyba při mazání zákazníka.', error: err });
                        }

                        res.status(200).json({ message: `✅ Zákazník s e-mailem ${email} byl úspěšně smazán.` });
                    });
                });
            });
        });
    });
};