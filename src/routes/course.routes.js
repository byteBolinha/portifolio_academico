const express = require('express');
const router = express.Router();
const Auth = require('../middleware/jwt.middleware');
const requirePermissions = require('../middleware/requirePermission.middleware');
const Courses = require('../models/courses.model');

router.get('/', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    try {
        const courses = await Courses.findAll(req.db);
        
        if (courses.length === 0) {
            return res.status(500).json({ error: 'Erro ao listar os cursos.' });
        }
        return res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

router.get('/user/:user_id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    const { user_id } = req.params;

    try {
        const userCourses = await Courses.findByUserId(req.db, user_id);
        
        if (!userCourses) {
            return res.status(404).json({ error: 'Nenhum curso encontrado para este usuário ou erro na busca.' });
        }
        
        return res.status(200).json(userCourses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

router.post('/', Auth, requirePermissions('CRIAR_CURSO'), async (req, res) => {
    const { name, launch_date, course_icon } = req.body;

    if (!name || !created_at || !course_icon) {
        return res.status(400).json({ 
            error: 'Os campos name, created_at e course_icon são obrigatórios.' 
        });
    }

    try {
        const newCourse = await Courses.create(req.db, name, created_at, course_icon);

        if (!newCourse) {
            return res.status(500).json({ error: 'Erro ao tentar salvar o curso no banco.' });
        }

        return res.status(201).json({
            message: 'Curso criado com sucesso!',
            course: newCourse
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno ao criar curso.' });
    }
});

router.post('/:course_id/enroll', Auth, requirePermissions('ASSIGN_USER_COURSE'), async (req, res) => {
    const { course_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'O campo user_id é obrigatório no corpo da requisição.' });
    }
    try {
        await Courses.enrollUser(req.db, course_id, user_id);
        return res.status(201).json({ 
            message: 'Usuário vinculado ao curso com sucesso!' 
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este usuário já está vinculado a este curso.' });
        }
        return res.status(500).json({ error: 'Erro interno ao vincular usuário ao curso.' });
    }
});

router.patch('/:id/deactivate', Auth, requirePermissions('DEACTIVATE_COURSE'), async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Courses.deactivate(req.db, id);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Curso não encontrado ou nenhuma alteração foi realizada.' 
            });
        }
        return res.status(200).json({ 
            message: 'Curso desativado com sucesso!' 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno ao desativar o curso.' });
    }
});

module.exports = router;