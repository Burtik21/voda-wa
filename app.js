const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const firmRoutes = require('./routes/firmRoutes')
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));


app.use(express.json());

// 📌 Autentizační endpointy
app.use('/voda/auth', authRoutes);

// 🔒 Chráněné endpointy pro zákazníky
app.use('/voda/firm', firmRoutes);

app.use('/voda/customer', customerRoutes);

app.use('/voda/report', reportRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}`);
});
