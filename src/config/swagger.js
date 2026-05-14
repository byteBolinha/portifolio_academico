const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const swaggerDocument = yaml.load(
    fs.readFileSync(path.resolve(__dirname, '../../swagger.yaml'), 'utf8')
);

module.exports = swaggerDocument;