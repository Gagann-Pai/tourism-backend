require('dotenv').config();
const PORT = process.env.PORT || 7000;
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { main } = require('./config/db');
const placeRoutes = require('./routes/placeRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://ghumo-ji-cnfv.vercel.app"],
    credentials: true
}));
app.use(express.json());
app.set("trust proxy", 1);

app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

async function start() {
    await main();
    app.use('/api/places', placeRoutes);
    app.use('/api/users', userRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();