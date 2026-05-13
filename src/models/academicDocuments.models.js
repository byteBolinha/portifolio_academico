class AcademicDocuments{
    constructor(name,competency_id,documentType_id,matriz,trimestre){
        this.name = name;
        this.competency_id = competency_id;
        this.documentType_id = documentType_id;
        this.matriz = matriz;
        this.trimestre = trimestre;
    };

    static async create(db, academicDocuments){
        const [result] = await db.query(
            `INSERT INTO academic_documents (name_academicD, competency_id, id_documentType, matriz, trimestre) VALUES(?,?,?,?,?)`,
            [academicDocuments.name, academicDocuments.competency_id, academicDocuments.documentType_id, academicDocuments.matriz, academicDocuments.trimestre]
        );
        return result;
    };
}