const {MongoClient} = require('mongodb');
require('dotenv').config();
const url = process.env.MONGO_URL;
const client = new MongoClient(url);

let db;

async function main() {
    await client.connect();
    console.log('Connected to the database');

    db = client.db("TOURISM");

}
module.exports = { main, db: () => db };    