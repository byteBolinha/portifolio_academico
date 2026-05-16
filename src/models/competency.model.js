class Competency {
  constructor(name, course_id, code_competency) {
    this.name = name;
    this.course_id = course_id;
    this.code_competency = code_competency;
  }

  static async create(db, competency) {
    const [result] = await db.query(
      `INSERT INTO competency (name_competency, course_id, code_competency)
             VALUES(?,?,?)`,
      [competency.name, competency.course_id, competency.code_competency],
    );
    return result;
  }

  static async findByCourse(db, course_id) {
    const [result] = await db.query(
      `
    SELECT 
      c.id_competency,
      c.name_competency,
      c.code_competency,

      a.id_academicD,
      a.name_academicD,
      a.matriz,
      a.trimestre,
      a.drive_link,

      a.flag_validacao_coordenacao,
      a.flag_liberado_customizar,
      a.flag_disponivel_canva,
      a.flag_integrado_rm,

      dt.name_documentType

    FROM competency c
    LEFT JOIN academic_documents a 
      ON a.competency_id = c.id_competency

    LEFT JOIN document_types dt
      ON dt.id_documentType = a.id_documentType

    WHERE c.course_id = ?
    `,
      [course_id],
    );

    return result;
  }

  static async findById(db, id) {
    const [result] = await db.query(
      `SELECT 
  id_competency,
  name_competency,
  code_competency
FROM competency
WHERE course_id = ?`,
      [id],
    );
    return result;
  }
}

module.exports = Competency;
