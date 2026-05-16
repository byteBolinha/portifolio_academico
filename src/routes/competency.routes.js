const express = require('express');
const router = express.Router();
const Competency = require('../models/competency.model');
const Auth = require('../middleware/jwt.middleware');
const requirePermissions = require('../middleware/requirePermission.middleware')

router.post('/', Auth, requirePermissions('CRIAR_COMPETENCIA'), async (req, res) => {
    const { name_competency, course_id, code_competency } = req.body;

    try {
        const result = await Competency.create(req.db, {
            name: name_competency,
            course_id,
            code_competency
        });

        res.status(201).json({
    id: result.insertId,
    message: "Competência criada."
});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/course/:course_id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    const { course_id } = req.params;

    try {
        const results = await Competency.findByCourse(req.db, course_id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Competency.findById(req.db, id);
        if (!result) return res.status(404).json({ message: "Não encontrado." });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;