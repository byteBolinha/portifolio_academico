//organizar a query entre microsoft e nosso JWT RBAC, etc.
class User{
    
    constructor(id,microsoft_id,email,name,role_id,created_at){
        this.id = id;
        this.microsoft_id = microsoft_id;
        this.email = email;
        this.name = name;
        this.role_id = role_id;
        this.created_at = created_at;
    }

    static async create(db, user) {
        const [result] = await db.query(
            `INSERT INTO users (microsoft_id, email, name, role_id)
            VALUES (?, ?, ?, ?)`,
            [user.microsoft_id, user.email, user.name, user.role_id]
        );

        return result.insertId;
    }
    static async findByMicrosoftId(db, microsoft_id,){
        const user_exists = await db.query(
            ``
        )

    }

}

module.exports = User;