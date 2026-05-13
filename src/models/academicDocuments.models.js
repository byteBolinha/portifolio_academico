class AcademicDocuments {
    constructor(name, competency_id, documentType_id, matriz, trimestre) {
        this.name = name;
        this.competency_id = competency_id;
        this.documentType_id = documentType_id;
        this.matriz = matriz;
        this.trimestre = trimestre;
    };

    static async create(db, academicDocuments) {
        const [result] = await db.query(
            `INSERT INTO academic_documents (name_academicD, competency_id, id_documentType, matriz, trimestre) VALUES(?,?,?,?,?)`,
            [academicDocuments.name, academicDocuments.competency_id, academicDocuments.documentType_id, academicDocuments.matriz, academicDocuments.trimestre]
        );
        return result;
    };

    static async updateFlagLiberadoCustomizar(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_liberado_customizar = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }
    static async updateFlagPreenchido(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_preenchido = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }
    static async updateFlagValidacaoCoordenacao(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_validacao_coordenacao = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }
    static async updateFlagIntegradoRM(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_integrado_rm = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }
    static async updateFlagDisponivelCanva(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_disponivel_canva = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }

    //atualizar o link do Drive quando o documento for gerado, deve ser importante.
    static async updateDriveLink(db, id, link) {
        return await db.query(
            `UPDATE academic_documents SET drive_link = ? WHERE id_academicD = ?`,
            [link, id]
        );
    }
}