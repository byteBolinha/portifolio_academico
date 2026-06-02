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

    //padrão, criamos aqui:
    static async create(db, user) {
    const [result] = await db.query(
        `INSERT INTO users (microsoft_id, email_users, name_users, roles_id)
        VALUES (?, ?, ?, ?)`,
        [
            user.microsoft_id,
            user.email_users,
            user.name_users,
            1
        ]
    );

    return result.insertId;
}

    //valida se o usuário da microsoft já foi criado na nossa relação:
    static async findByMicrosoftId(db, microsoft_id,){
        const [result] = await db.query(
            `SELECT * FROM users WHERE microsoft_id=?`, [microsoft_id]
        ) //os erros é em relação a lista, ele volta uma vazia (se não encontrar nada) e é true.

        if(result.length === 0){
            return null;
        }
        return result[0];
    }

}

module.exports = User;