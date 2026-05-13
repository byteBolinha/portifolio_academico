class DocumentType{
    constructor(name){
        this.name = name
    }

    static async create(db, document_types){
        const [result] = await db.query(
            `INSERT INTO document_types (name_documentType) VALUES (?)`,
            [document_types.name]
        );
        return result;
    };

    static async findById(db, document_types_id){
        const [result] = await db.query(
            `SELECT * FROM document_types WHERE id_documentType = ?`,
            [document_types_id]
        );
        return result;
    };

    static async findAll(db){
        const [result] = await db.query(
            `SELECT * FROM document_types`
        );
        return result;
    };
};