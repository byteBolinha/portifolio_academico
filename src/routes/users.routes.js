const express = require('express');
const router = express.Router();
const Auth = require('../middleware/jwt.middleware');
const User = require('../models/user.model')
const requirePermissions = require('../middleware/requirePermission.middleware');

router.get('/', Auth, requirePermissions('READ_ALL'), async (req, res)=>{

    try {
        const users = await User.findAllUsers(req.db);
        return res.status(200).json(users);    
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error:'erro interno no servidor'
        });
    }
    
});

router.patch('/users/:id/role', Auth, requirePermissions('MANAGE_PERMISSIONS'), async(req, res)=>{
    try {
        const {id} = req.params;
        const {role_id} = req.body;
            if (!role_id){
                return res.status(400).json({error:'O campo role_id é obrigatório'});
            };
        
        await User.updateRole(req.db, id, role_id);
        return res.status(200).json({message:'Role alterada com sucesso.'});

    } catch (err) {
        console.log(err);
        return res.status(500).json({error:'Erro interno no servidor ao tentar atualizar a permissão.'})
    }
    
})


router.post('/users/:id/courses', Auth, requirePermissions('ASSIGN_USER_COURSE'), async (req, res) => {
    const { id } = req.params;
    const { course_id } = req.body;

    if (!course_id) {
        return res.status(400).json({ error: 'O campo course_id é obrigatório.' });
    }

    try {
        const result = await User.enrollInCourse(req.db, id, course_id);
        
        return res.status(201).json({ 
            message: 'Usuário vinculado ao curso com sucesso!' 
        });
    } catch (err) {
        console.error(err);
        // Tratamento caso o banco rejeite por erro de chave estrangeira (FK) ou duplicidade
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Usuário já está vinculado a este curso.' });
        }
        return res.status(500).json({ error: 'Erro interno ao vincular curso.' });
    }
});

router.patch('/users/:id/deactivate', Auth, requirePermissions('DEACTIVE_USER'), async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.deactivateUser(req.db, id);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ 
            message: 'Usuário desativado com sucesso!' 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno ao desativar usuário.' });
    }
});

module.exports = router;