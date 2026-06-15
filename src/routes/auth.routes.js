const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

router.post('/login', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log('token recebido:', token ? token.substring(0, 50) + '...' : 'NULO');

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
        console.log('microsoftUser:', microsoftUser);

        // Tentar capturar a foto de perfil
        let avatarUrl = null;
        try {
            const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (photoResponse.ok) {
                const buffer = Buffer.from(await photoResponse.arrayBuffer());
                const fileName = `avatar-${microsoftUser.id}.jpg`;
                const uploadPath = path.join(__dirname, '../../uploads', fileName);
                
                if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
                    fs.mkdirSync(path.join(__dirname, '../../uploads'));
                }

                fs.writeFileSync(uploadPath, buffer);
                avatarUrl = `/uploads/${fileName}`;
            }
        } catch (photoError) {
            console.log('Usuário sem foto ou erro ao capturar:', photoError.message);
        }

        const [users] = await req.db.query(
            `SELECT u.*, r.name_roles 
             FROM users u 
             LEFT JOIN roles r ON u.roles_id = r.id_roles 
             WHERE u.microsoft_id = ?`, 
            [microsoftUser.id]
        );

        let user = users.length > 0 ? users[0] : null;

        if (user === null) {
            const [userCount] = await req.db.query('SELECT COUNT(*) as total FROM users');
            const isFirstUser = userCount[0].total === 0;
            
            let roleToAssign = 4;

            if (isFirstUser) {
                roleToAssign = 1;
            } else if (microsoftUser.jobTitle && microsoftUser.jobTitle.toUpperCase().includes('COORDENADOR')) {
                roleToAssign = 3;
            }

            await User.create(req.db, {
              microsoft_id: microsoftUser.id,
              email_users: microsoftUser.mail || microsoftUser.userPrincipalName,
              name_users: microsoftUser.displayName,
              avatar_users: avatarUrl,
              role_id: roleToAssign
            });
            
            const [newUsers] = await req.db.query(
                `SELECT u.*, r.name_roles 
                 FROM users u 
                 LEFT JOIN roles r ON u.roles_id = r.id_roles 
                 WHERE u.microsoft_id = ?`, 
                [microsoftUser.id]
            );
            user = newUsers[0];
        } else if (avatarUrl && user.avatar_users !== avatarUrl) {
            await req.db.query('UPDATE users SET avatar_users = ? WHERE id_users = ?', [avatarUrl, user.id_users]);
            user.avatar_users = avatarUrl;
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

        return res.status(200).json({ 
            token: jwtToken,
            user: {
                id: user.id_users,
                name: user.name_users,
                email: user.email_users,
                role: user.name_roles
            }
        });

    } catch (error) {
        console.error("Erro no processo de login:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
});

module.exports = router;