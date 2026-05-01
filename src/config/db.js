require('dotenv').config();

let mysql = require('mysql');

let con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit: 10
});

module.exports = pool;