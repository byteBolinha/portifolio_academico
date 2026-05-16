class Course {
  constructor(name_courses, launch_date_courses, course_icon_url) {
    this.name_courses = name_courses;
    this.launch_date_courses = launch_date_courses;
    this.course_icon_url = course_icon_url;
  }


  static async create(db, course) {
    const [result] = await db.query(
      `
      INSERT INTO courses (name_courses, launch_date_courses, course_icon_url)
      VALUES (?, ?, ?)
      `,
      [
        course.name_courses,
        course.launch_date_courses || null,
        course.course_icon_url || null,
      ]
    );

    return result;
  }


  static async findAll(db) {
    const [result] = await db.query(
      `
      SELECT 
        id_courses,
        name_courses,
        launch_date_courses,
        created_at_courses,
        course_icon_url
      FROM courses
      ORDER BY id_courses DESC
      `
    );

    return result;
  }


  static async findById(db, id) {
    const [result] = await db.query(
      `
      SELECT 
        id_courses,
        name_courses,
        launch_date_courses,
        created_at_courses,
        course_icon_url
      FROM courses
      WHERE id_courses = ?
      `,
      [id]
    );

    return result[0];
  }
}

module.exports = Course;