require('dotenv').config();
const PORT = process.env.PORT || 7000;
const express = require('express');
const app = express();
const cors = require('cors');
const { main } = require('./config/db');
const placeRoutes = require('./routes/placeRoutes');
app.use(cors());
app.use(express.json());


async function start() {
    await main();
    app.use('/api/places',placeRoutes); 
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    
}

start();