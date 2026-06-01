class Notification {
  static async create(db, notification) {
    const [result] = await db.query(
      `
      INSERT INTO notifications (
        user_id,
        competency_id,
        document_id,
        title,
        message
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        notification.user_id || null,
        notification.competency_id,
        notification.document_id,
        notification.title,
        notification.message,
      ],
    );

    return result;
  }

  static async findAll(db) {
    const [result] = await db.query(
      `
    SELECT
      n.id_notification,
      n.title,
      n.message,
      n.is_read,
      n.created_at,

      c.name_competency,
      c.code_competency,

      courses.name_courses

    FROM notifications n

    LEFT JOIN competency c
      ON c.id_competency = n.competency_id

    LEFT JOIN courses
      ON courses.id_courses = c.course_id

    ORDER BY n.created_at DESC
    `,
    );

    return result;
  }

  static async findByCourse(db, courseId) {
    const [result] = await db.query(
      `
    SELECT
      n.id_notification,
      n.title,
      n.message,
      n.is_read,
      n.created_at,

      c.name_competency,
      c.code_competency,
      c.course_id,

      courses.name_courses

    FROM notifications n

    LEFT JOIN competency c
      ON c.id_competency = n.competency_id

    LEFT JOIN courses
      ON courses.id_courses = c.course_id

    WHERE c.course_id = ?

    ORDER BY n.created_at DESC
    `,
      [courseId],
    );

    return result;
  }

  static async markAsRead(db, id) {
    return await db.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id_notification = ?
      `,
      [id],
    );
  }

  static async delete(db, id) {
    const [result] = await db.query(
      `
    DELETE FROM notifications
    WHERE id_notification = ?
    `,
      [id],
    );

    return result;
  }
}

module.exports = Notification;
