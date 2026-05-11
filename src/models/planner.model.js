class PlannerModel {
    
    //Busca um documento (Planner ou Plano de Ensino) pelo ID.
    static async getById(db, documentId) {
        const [rows] = await db.query(
            `SELECT * FROM academic_documents WHERE id_document = ?`,
            [documentId]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    //Atualiza o status de um documento.
    static async updateStatus(db, documentId, novoStatus) {
        const [result] = await db.query(
            `UPDATE academic_documents SET status_atual = ? WHERE id_document = ?`,
            [novoStatus, documentId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = PlannerModel;