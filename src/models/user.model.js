//organizar a query entre microsoft e nosso JWT RBAC, etc.
class User{
    
    constructor(id,microsoft_id,email,name,role_id,created_at){
        this.id = id; 
        this.microsoft_id = microsoft_id; //microsoft retorna o próprio dele
        this.email = email;
        this.name = name;
        this.role_id = role_id;
        this.created_at = created_at;
    }

    static async create(db, user) {
    const [result] = await db.query(
        `INSERT INTO users (microsoft_id, email_users, name_users, roles_id, avatar_users)
        VALUES (?, ?, ?, ?, ?)`,
        [
            user.microsoft_id,
            user.email_users,
            user.name_users,
            user.role_id,
            user.avatar_users
        ]
    );

    return result.insertId;
}

    static async findByMicrosoftId(db, microsoft_id,){
        const [result] = await db.query(
            `SELECT * FROM users WHERE microsoft_id=?`, [microsoft_id]
        ) 

        if(result.length === 0){
            return null;
        }
        return result[0];
    }

    static async findPermissionsByRoleId(db, role_id){
        try {
            const [result] = await db.query(
            'SELECT p.name_permissions FROM permissions p JOIN roles_permissions rp ON rp.permissions_id = p.id_permissions WHERE rp.roles_id = ?',
            [role_id]
        )
        if (result.length === 0){
            return null;
        }
        const permissions = [];
        for(const row of result){
            permissions.push(row.name_permissions);
        }
        return permissions;

        } catch (err) {
            return false;
        }
        
    }

    static async findAllUsers(db){
        try {
            const [result] = await db.query(
            'SELECT * FROM users'
            );
            return result.length ? result : null;

        } catch (err) {
            return false;
        }
        
    }

    static async updateRole(db, id, role_id) {
        try {
            const [result] = await db.query(
                'UPDATE users SET roles_id = ? WHERE id_users = ?',
                [role_id, id]
            );
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

 static async enrollInCourse(db, user_id, course_id) {
        try {
            const [result] = await db.query(
                'INSERT INTO users_courses (id_users, id_courses) VALUES (?, ?)',
                [user_id, course_id]
            );
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    static async deactivateUser(db, id) {
        try {
            const [result] = await db.query(
                'UPDATE users SET active = 0 WHERE id_users = ?',
                [id]
            );
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
module.exports = User;