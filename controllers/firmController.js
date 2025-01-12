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
