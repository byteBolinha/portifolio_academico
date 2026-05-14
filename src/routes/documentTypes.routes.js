const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Auth = require('../middleware/jwt.middleware')
const DocumentTypes = require('../models/documentType.model');
const requirePermissions = require('../middleware/requirePermission.middleware');

router.post('/', Auth, requirePermissions('CRIAR_TIPO_DE_DOCUMENTO'), async (req, res) => {
    try {
        const { name_documentType } = req.body;
        if (!name_documentType) return res.status(400).json({ message: "Nome é obrigatório." });
        const result = await DocumentTypes.create(req.db, name_documentType);
        res.status(201).json({ id: result.insertId, message: "Tipo de documento criado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    try {
        const results = await DocumentTypes.findAll(req.db);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;