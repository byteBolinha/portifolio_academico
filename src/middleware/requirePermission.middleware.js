const requirePermission = (permissionName) => {
    // Nativa agora no JWT, só requeriar a função do user.model.
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.permissions) {
                return res.status(403).json({ message: "Acesso negado. Nenhuma permissão encontrada." });
            }
            const hasPermission = req.user.permissions.includes(permissionName);
            if (hasPermission) {
                return next();
            }
            return res.status(403).json({ message: "Permissão insuficiente." });

        } catch (error) {
            console.error("Erro no middleware de permissão:", error);
            return res.status(500).json({ message: "Erro interno ao validar permissões." });
        }
    };
};

module.exports = requirePermission;