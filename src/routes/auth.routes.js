const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/login', async (req, res) => {
    let user = await User.findByMicrosoftId(req.db, req.body.microsoft_id);
    if(user === null){
        const newUser = await User.create(req.db, req.body);
        user = await User.findByMicrosoftId(req.db, req.body.microsoft_id);
    }

    //é o retorno do banco.
    const token = jwt.sign(
        {
            user_id: user.id_users,
            role_id: user.roles_id,
            email:   user.email_users
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );
    //200, antes era 400 porém 400 é bad request...
    return res.status(200).json({token});

})

module.exports = router;