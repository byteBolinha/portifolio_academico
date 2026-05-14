const requirePermissions = (permissionName) => {
    return async (req, res, next) => {
        try {
            const [result] = await req.db.query(
            `SELECT p.name_permissions 
            FROM roles_permissions rp
            JOIN permissions p ON rp.permissions_id = p.id_permissions
            WHERE rp.roles_id = ?`,
            [req.user.roles_id]
        );
        const filtered = result.some(p => p.name_permissions === permissionName) //tirar da lista

        if(filtered){
            return next();

        }return res.status(403).json({message: 'Permissão insuficiente'})

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao validar permissões', error });  
        }

    };
}

module.exports = requirePermissions;