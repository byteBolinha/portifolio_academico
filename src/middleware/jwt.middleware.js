const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {


    if (process.env.SKIP_AUTH === "true") {
        req.user = {
            id: 1,
            roles_id: 1,
            role: "admin",
            permissions: [
                "CRIAR_COMPETENCIA",
                "READ_ALL"
            ]
        };
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