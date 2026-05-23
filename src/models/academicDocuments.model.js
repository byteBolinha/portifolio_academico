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
    }

    static async updateFlagLiberadoCustomizar(db, id, status) {
        return await db.query(
            `UPDATE academic_documents SET flag_liberado_customizar = ? WHERE id_academicD = ?`,
            [status, id]
        );
    }

    static async updateFlagValidadoGestao(db, id, status) {
        return await db.query(
            `UPDATE academic_documents
         SET flag_validado_gestao = ?
         WHERE id_academicD = ?`,
            [status, id]
        );
    }

    static async updateFlagModeloPronto(db, id, status) {
        return await db.query(
            `UPDATE academic_documents
         SET flag_modelo_pronto = ?
         WHERE id_academicD = ?`,
            [status, id]
        );
    }

    static async updateFlagIntegradoCanvas(db, id, status) {
        return await db.query(
            `UPDATE academic_documents
         SET flag_integrado_canvas = ?
         WHERE id_academicD = ?`,
            [status, id]
        );
    }

    static async updateFlagPreenchido(db, id, status) {
        return await db.query(
            `UPDATE academic_documents
         SET flag_preenchido = ?
         WHERE id_academicD = ?`,
            [status, id]
        );
    }

    static async updateFlagValidadoCoordenacao(db, id, status) {
        return await db.query(
            `UPDATE academic_documents
         SET flag_validado_coordenacao = ?
         WHERE id_academicD = ?`,
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

    //atualizar o link do Drive quando o documento for gerado
    static async updateDriveLink(db, id, link) {
        return await db.query(
            `UPDATE academic_documents SET drive_link = ? WHERE id_academicD = ?`,
            [link, id]
        );
    }

    static async update(db, id, data) {
        const {
            name,
            competency_id,
            documentType_id,
            matriz,
            trimestre,
            updated_by
        } = data;

        const [result] = await db.query(
            `UPDATE academic_documents
         SET
            name_academicD = ?,
            competency_id = ?,
            id_documentType = ?,
            matriz = ?,
            trimestre = ?,
            updated_by = ?
         WHERE id_academicD = ?`,
            [
                name,
                competency_id,
                documentType_id,
                matriz,
                trimestre,
                updated_by,
                id
            ]
        );

        return result;
    }

    // FINDs
    static async findByCompetency(db, competency_id) {
        const [result] = await db.query(
            `SELECT * FROM academic_documents WHERE competency_id = ?`,
            [competency_id]
        );
        return result;
    }

    static async findAll(db) {
        const [result] = await db.query(
            `SELECT * FROM academic_documents WHERE active = 1`
        );

        return result;
    }
    
    static async findById(db, id) {
        const [result] = await db.query(
            `SELECT * FROM academic_documents WHERE id_academicD = ?`,
            [id]
        );
        return result[0];
    };

    // DESATIVAR DOCUMENTO (SOFT DELETE)
    static async deactivateById(db, id, reason = null) {
        const [result] = await db.query(
            `UPDATE academic_documents SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id_academicD = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }
}