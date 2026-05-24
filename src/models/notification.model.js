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
      ]
    );

    return result;
  }

  static async findAll(db) {
    const [result] = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);

    return result;
  }

  static async markAsRead(db, id) {
    return await db.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id_notification = ?
      `,
      [id]
    );
  }
}

module.exports = Notification;