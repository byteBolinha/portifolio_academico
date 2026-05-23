const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/login', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token não fornecido." });
        }
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            return res.status(401).json({ message: "Token da Microsoft inválido ou expirado." });
        }
        const microsoftUser = await response.json();
        let user = await User.findByMicrosoftId(req.db, microsoftUser.id);
        if (user === null) {
            await User.create(req.db, {
                microsoft_id: microsoftUser.id,
                email: microsoftUser.mail || microsoftUser.userPrincipalName,
                name: microsoftUser.displayName
            });

            user = await User.findByMicrosoftId(req.db, microsoftUser.id);

            if (!user.active) {
                return res.status(403).json({
                    message: 'Usuário desativado.'
                });
            }
        }
        const permissions = await User.findPermissionsByRoleId(req.db, user.roles_id);

        const jwtToken = jwt.sign(
            {
                user_id: user.id_users,
                role_id: user.roles_id,
                email: user.email_users,
                permissions: permissions
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        return res.status(200).json({ token: jwtToken });

    } catch (error) {
        console.error("Erro no processo de login:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
});
module.exports = router;