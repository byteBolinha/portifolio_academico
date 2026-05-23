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
            [competency.name, competency.course_id, competency.code_competency]
        );
        return result
    };

    static async findByCourse(db, course_id) {
        const [result] = await db.query(
            `SELECT * FROM competency WHERE course_id = ?`,
            [course_id]
        );

        return result;
    }

    static async findById(db, id) {
        const [result] = await db.query(
            `SELECT * FROM competency WHERE id_competency = ?`,
            [id]
        );
        return result;
    }
}