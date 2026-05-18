const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {


   if (process.env.SKIP_AUTH === "true") {

    const role = process.env.MOCK_ROLE || "ADMIN";

    const users = {
    ADMIN: {
        id: 1,
        roles_id: 1,
        role: "ADMIN",
        permissions: [
            "CRIAR_COMPETENCIA",
            "READ_ALL",
            "LIBERAR_CUSTOMIZACAO",
            "FLAG_PREENCHIDO",
            "FLAG_AVALIADO_COORD",
            "FLAG_AVALIADO_GESTAO",
            "FLAG_CANVAS_INTEGRATION",
            "MANAGE_LINKS_DRIVE",
            "DELET_DOCUMENT"
        ]
    },

    PROFESSOR: {
        id: 2,
        roles_id: 2,
        role: "PROFESSOR",
        permissions: [
            "READ_ALL"
        ]
    }
};

    req.user = users[role];

    return next();
}

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não foi fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'token invalido ou expirado!' });
    }
};

module.exports = Auth;