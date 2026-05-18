class Courses{
    constructor(name, created_at, course_icon){
        this.name = name;
        this.created_at = created_at;
        this.course_icon = course_icon;
    }

    static async findAll(db){
        try {
            const [result] = await db.query(
            'SELECT * FROM courses'
            );
            return result ? result:false;
        
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async enrollUser(db, course_id, user_id) {
        try {
            const [result] = await db.query(
                'INSERT INTO users_courses (id_courses, id_users) VALUES (?, ?)',
                [course_id, user_id]
            );
            return result;
        } catch (err) {
            console.error(err);
            throw err; // lançar para ser tratado com a requisição
        }
    }

    static async findByUserId(db, user_id) {
        try {
            const [result] = await db.query(
                `SELECT c.* FROM courses c 
                JOIN user_courses uc ON c.id_courses = uc.course_id 
                WHERE uc.user_id = ?`,
                [user_id]
            );
            return result;
        }catch (err) {
            console.error(err);
            return false;
        };
    }

    static async create(db, name, created_at, course_icon) {
        try {
            const [result] = await db.query(
                'INSERT INTO courses (name_courses, launch_date_courses, course_icon_url) VALUES (?, ?, ?)',
                [name, created_at, course_icon]
            );
        
            return {
                id_courses: result.insertId,
                name,
                created_at,
                course_icon
            };
        } catch (err) {
            console.error(err);
            return false;
        };
    };
    static async deactivate(db, id) {
        try {
            const [result] = await db.query(
                'UPDATE courses SET active = 0 WHERE id_courses = ?',
                [id]
            );
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
};

module.exports = Courses;