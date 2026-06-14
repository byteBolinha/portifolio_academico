class AcademicDocuments {
  constructor(name, competency_id, documentType_id, trimestre) {
    this.name = name;
    this.competency_id = competency_id;
    this.documentType_id = documentType_id;
    this.trimestre = trimestre;
  }

  static async create(db, academicDocuments) {
    const [result] = await db.query(
      `
      INSERT INTO academic_documents (
        name_academicD,
        competency_id,
        id_documentType,
        matriz_competency,
        trimestre,
        drive_link
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        academicDocuments.name,
        academicDocuments.competency_id,
        academicDocuments.documentType_id,
        academicDocuments.matriz,
        academicDocuments.trimestre,
        academicDocuments.drive_link,
      ],
    );

    return result;
  }

  static async updateFlagLiberadoCustomizar(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_liberado_customizar = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateFlagPreenchido(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_preenchido = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateFlagNecessitaRevisao(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_necessita_revisao = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateFlagValidacaoCoordenacao(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_validacao_coordenacao = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateFlagIntegradoRM(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_integrado_rm = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateFlagDisponivelCanva(db, id, status) {
    return await db.query(
      `UPDATE academic_documents SET flag_disponivel_canva = ? WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateTrimestre(db, id, trimestre) {
    return await db.query(
      `UPDATE academic_documents 
             SET trimestre = ? 
             WHERE id_academicD = ?`,
      [trimestre, id],
    );
  }

  static async updateFlagEmPreenchimento(db, id, status) {
    return await db.query(
      `UPDATE academic_documents 
         SET flag_em_preenchimento = ? 
         WHERE id_academicD = ?`,
      [status, id],
    );
  }

  static async updateDriveLink(db, id, link) {
    return await db.query(
      `UPDATE academic_documents SET drive_link = ? WHERE id_academicD = ?`,
      [link, id],
    );
  }

  // FINDs
  static async findByCompetency(db, competency_id) {
    const [result] = await db.query(
      `SELECT * FROM academic_documents WHERE competency_id = ?`,
      [competency_id],
    );
    return result;
  }

  static async findAll(db) {
    return await db.query(`SELECT * FROM academic_documents`);
  }

  static async findById(db, id) {
    const [result] = await db.query(
      `SELECT * FROM academic_documents WHERE id_academicD = ?`,
      [id],
    );
    return result[0];
  }

  // DELETE
  static async deletById(db, id) {
    const [result] = await db.query(
      `DELETE FROM academic_documents WHERE id_academicD = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }

  static async updateByCompetencyAndType(
  db,
  competency_id,
  documentType_id,
  data
) {
  return await db.query(
    `
    UPDATE academic_documents
    SET
      drive_link = ?,
      trimestre = ?
    WHERE competency_id = ?
    AND id_documentType = ?
    `,
    [
      data.drive_link,
      data.trimestre,
      competency_id,
      documentType_id,
    ]
  );
}

static async deleteByCompetency(db, competencyId) {
  const [result] = await db.query(
    `DELETE FROM academic_documents
     WHERE competency_id = ?`,
    [competencyId]
  );

  return result;
}
}

module.exports = AcademicDocuments;
