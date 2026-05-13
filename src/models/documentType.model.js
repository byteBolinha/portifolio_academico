class DocumentType{
    constructor(name){
        this.name = name
    }

    static async create(db, document_types){
        const [result] = await db.query(
            `INSERT INTO document_types VALUES (?)`,
            [document_types.name]
        )
        return result;
    }
}