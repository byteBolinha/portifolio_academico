const express = require('express');
const router = express.Router();
const Competency = require('../models/competency.model');
const Auth = require('../middleware/jwt.middleware');
const requirePermissions = require('../middleware/requirePermission.middleware')

router.post('/', Auth, requirePermissions('CRIAR_COMPETENCIA'), async (req, res) => {
    const { name_competency, courses_id } = req.body;

    try {
        
    } catch (err) {
        
    }
});

router.get('/course/:course_id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    const { course_id } = req.params;

    try {
        
    } catch (err) {
        
    }
});

router.get('/:id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    const { id } = req.params;

    try {
        
    } catch (err) {
        
    }
});

module.exports = router;