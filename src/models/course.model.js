class Course {
  constructor(name_courses, matrix_courses, course_icon_url) {
    this.name_courses = name_courses;
    this.matrix_courses = matrix_courses;
    this.course_icon_url = course_icon_url;
  }

  static async create(db, course) {
    const [result] = await db.query(
      `
      INSERT INTO courses (
        name_courses,
        matrix_courses,
        course_icon_url
      )
      VALUES (?, ?, ?)
      `,
      [
        course.name_courses,
        course.matrix_courses || null,
        course.course_icon_url || null,
      ],
    );

    return result;
  }

  static async delete(db, id) {
    const [result] = await db.query(
      `DELETE FROM courses WHERE id_courses = ?`,
      [id],
    );

    return result;
  }

  static async findAll(db) {
    const [result] = await db.query(
      `
      SELECT 
        id_courses,
        name_courses,
        matrix_courses,
        created_at_courses,
        course_icon_url
      FROM courses
      ORDER BY name_courses ASC
      `,
    );

    return result;
  }

  static async update(db, id, course) {
    const [result] = await db.query(
      `
    UPDATE courses
    SET
      name_courses = ?,
      matrix_courses = ?,
      course_icon_url = ?
    WHERE id_courses = ?
    `,
      [course.name_courses, course.matrix_courses, course.course_icon_url, id],
    );

    return result;
  }

  static async findById(db, id) {
    const [result] = await db.query(
      `
      SELECT 
        id_courses,
        name_courses,
        matrix_courses,
        created_at_courses,
        course_icon_url
      FROM courses
      WHERE id_courses = ?
      `,
      [id],
    );

    return result[0];
  }
}

module.exports = Course;
