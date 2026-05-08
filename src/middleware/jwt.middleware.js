const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //baerer token

    if(!token){
        return res.status(401).json({message: 'Token não foi fornecido'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // as rotas passam (acessam) o req.user
        next();
    }catch(err){
        //forbidden (proibido)
        return res.status(403).json({message:'token invalido ou expirado!'})
    }
}