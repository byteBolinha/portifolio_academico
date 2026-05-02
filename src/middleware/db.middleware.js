const pool = require('../config/db');

const injectDb = (req, res, next) => {
    console.log('injectDb chamado');
    req.db = pool;
    next();
}

module.exports = injectDb;