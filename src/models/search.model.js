async function search(db, searchTerm) {
  const [courses] = await db.query(
    `
    SELECT
      id_courses,
      name_courses
    FROM courses
    WHERE name_courses LIKE ?
    `,
    [`%${searchTerm}%`]
  );

  const [competencies] = await db.query(
    `
    SELECT
      competency.id_competency,
      competency.name_competency,
      competency.code_competency,
      competency.matriz_competency,
      courses.id_courses,
      courses.name_courses
    FROM competency
    JOIN courses
      ON competency.course_id = courses.id_courses
    WHERE
      competency.name_competency LIKE ?
    `,
    [`%${searchTerm}%`]
  );

  return {
    courses,
    competencies,
  };
}

module.exports = {
  search,
};