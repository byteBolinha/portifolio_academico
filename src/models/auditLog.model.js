class AuditLog {
    static async create(db, logData) {
    try {
      const [result] = await db.query(
        `INSERT INTO audit_log
          (user_id, user_name, user_role, action, entity, entity_id,
           old_value, new_value, description, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          logData.user_id,
          logData.user_name     || 'Desconhecido',
          logData.user_role     || 'Desconhecido',
          logData.action,
          logData.entity,
          logData.entity_id     || null,
          logData.old_value     ? JSON.stringify(logData.old_value) : null,
          logData.new_value     ? JSON.stringify(logData.new_value) : null,
          logData.description   || null,
          logData.ip_address    || null,
        ],
      );
      return result.insertId;
    } catch (err) {
      // Log não pode quebrar a requisição principal — apenas loga no console
      console.error('[AuditLog] Erro ao salvar log:', err);
      return null;
    }
  } 

   static async findAll(db, { limit = 100, offset = 0 } = {}) {
    const [rows] = await db.query(
      `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

    static async findByUser(db, user_id, { limit = 100, offset = 0 } = {}) {
    const [rows] = await db.query(
      `SELECT * FROM audit_log
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset],
    );
    return rows;
  }

    static async findByEntity(db, entity, entity_id) {
    const [rows] = await db.query(
      `SELECT * FROM audit_log
       WHERE entity = ? AND entity_id = ?
       ORDER BY created_at DESC`,
      [entity, entity_id],
    );
    return rows;
  }

    static async findByAction(db, action, { limit = 100, offset = 0 } = {}) {
    const [rows] = await db.query(
      `SELECT * FROM audit_log
       WHERE action = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [action, limit, offset],
    );
    return rows;
  }

    static async findDocumentValidationLogs(db, { limit = 100, offset = 0 } = {}) {
    const [rows] = await db.query(
      `SELECT
          al.*,
          ad.name_academicD AS document_name
       FROM audit_log al
       LEFT JOIN academic_documents ad ON al.entity_id = ad.id_academicD
       WHERE al.entity = 'academic_documents'
         AND al.action IN (
           'FLAG_VALIDACAO_COORDENACAO',
           'FLAG_PREENCHIDO',
           'FLAG_LIBERADO_CUSTOMIZAR',
           'FLAG_INTEGRADO_RM',
           'FLAG_DISPONIVEL_CANVA',
           'FLAG_NECESSITA_REVISAO',
           'FLAG_EM_PREENCHIMENTO'
         )
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

    static async findByDocument(db, document_id) {
    const [rows] = await db.query(
      `SELECT
          al.*,
          ad.name_academicD AS document_name
       FROM audit_log al
       LEFT JOIN academic_documents ad ON al.entity_id = ad.id_academicD
       WHERE al.entity = 'academic_documents'
         AND al.entity_id = ?
       ORDER BY al.created_at DESC`,
      [document_id],
    );
    return rows;
  }
}

module.exports = AuditLog;