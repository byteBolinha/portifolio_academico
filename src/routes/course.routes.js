const express = require("express");
const router = express.Router();
const multer = require("multer");
const Auth = require("../middleware/jwt.middleware");
const requirePermissions = require("../middleware/requirePermission.middleware");
const Course = require("../models/course.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", Auth, requirePermissions("READ_ALL"), async (req, res) => {
  try {
    const results = await Course.findAll(req.db);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar cursos" });
  }
});

router.get("/user/:user_id", Auth, requirePermissions("READ_ALL"), async (req, res) => {
  const { user_id } = req.params;
  try {
    const userCourses = await Course.findByUserId(req.db, user_id);
    if (!userCourses) return res.status(404).json({ error: "Nenhum curso encontrado." });
    return res.status(200).json(userCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor.", error: err.message });
  }
});

router.post("/", Auth, requirePermissions("CRIAR_CURSO"), upload.single("image"), async (req, res) => {
  try {
    const { name_courses, matrix_courses } = req.body;
    const course_icon_url = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;
    const result = await Course.create(req.db, { name_courses, matrix_courses, course_icon_url });
    res.status(201).json({ id_courses: result.insertId, name_courses, matrix_courses, course_icon_url });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Esse curso já está cadastrado" });
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor", error: err.message });
  }
});

router.post("/:course_id/enroll", Auth, requirePermissions("ASSIGN_USER_COURSE"), async (req, res) => {
  const { course_id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "O campo user_id é obrigatório." });
  try {
    await Course.enrollUser(req.db, course_id, user_id);
    return res.status(201).json({ message: "Usuário vinculado ao curso com sucesso!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Usuário já vinculado a este curso." });
    console.error(err);
    res.status(500).json({ error: "Erro interno ao vincular usuário." });
  }
});

router.put("/:id", Auth, requirePermissions("CRIAR_CURSO"), upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name_courses, matrix_courses } = req.body;
    const existingCourse = await Course.findById(req.db, id);
    if (!existingCourse) return res.status(404).json({ message: "Curso não encontrado" });
    const course_icon_url = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : existingCourse.course_icon_url;
    await Course.update(req.db, id, { name_courses, matrix_courses, course_icon_url });
    res.status(200).json({ id_courses: id, name_courses, matrix_courses, course_icon_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar curso" });
  }
});

router.patch("/:id/deactivate", Auth, requirePermissions("DELETE_COURSE"), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Course.deactivate(req.db, id);
    if (!result || result.affectedRows === 0) return res.status(404).json({ error: "Curso não encontrado." });
    return res.status(200).json({ message: "Curso desativado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao desativar o curso." });
  }
});

router.delete("/:id", Auth, requirePermissions("DELETE_COURSE"), async (req, res) => {
  try {
    const { id } = req.params;
    const existingCourse = await Course.findById(req.db, id);
    if (!existingCourse) return res.status(404).json({ message: "Curso não encontrado" });
    await Course.delete(req.db, id);
    res.status(200).json({ message: "Curso excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir curso" });
  }
});

module.exports = router;