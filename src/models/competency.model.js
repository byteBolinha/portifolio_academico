class Competency {
  constructor(name, course_id, code_competency, matriz_competency) {
    this.name = name;
    this.course_id = course_id;
    this.code_competency = code_competency;
    this.matriz_competency = matriz_competency;
  }

  static async create(db, competency) {
    const [result] = await db.query(
      `INSERT INTO competency (name_competency, course_id, code_competency, matriz_competency)
             VALUES(?,?,?,?)`,
      [
        competency.name,
        competency.course_id,
        competency.code_competency,
        competency.matriz_competency,
      ],
    );
    return result;
  }

  static async update(db, competency) {
    const [result] = await db.query(
      `UPDATE competency
     SET name_competency = ?, code_competency = ?
     WHERE id_competency = ?`,
      [competency.name, competency.code_competency, competency.id],
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
      c.matriz_competency,

      a.id_academicD,
      a.name_academicD,
      
      a.trimestre,
      a.drive_link,

      a.flag_em_preenchimento,
      a.flag_preenchido,
      a.flag_necessita_revisao,
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
    `
    SELECT 
      c.id_competency,
      c.name_competency,
      c.code_competency,
      c.matriz_competency,

      MAX(
        CASE
          WHEN ad.id_documentType = 1
          THEN ad.drive_link
        END
      ) AS planner_link,

      MAX(
        CASE
          WHEN ad.id_documentType = 2
          THEN ad.drive_link
        END
      ) AS teaching_plan_link,

      MAX(ad.trimestre) AS trimestre

    FROM competency c

    LEFT JOIN academic_documents ad
      ON ad.competency_id = c.id_competency

    WHERE c.id_competency = ?

    GROUP BY
      c.id_competency,
      c.name_competency,
      c.code_competency,
      c.matriz_competency
    `,
    [id],
  );

  return result[0];
}

static async delete(db, id) {
  const [result] = await db.query(
    `DELETE FROM competency
     WHERE id_competency = ?`,
    [id]
  );

  return result;
}


}

module.exports = Competency;
