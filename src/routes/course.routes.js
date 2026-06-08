const express = require("express");
const router = express.Router();
const multer = require("multer");

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

router.get("/", async (req, res) => {
  try {
    const results = await Course.findAll(req.db);

    res.status(200).json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao buscar cursos",
    });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name_courses, matrix_courses } = req.body;

    const course_icon_url = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;

    const result = await Course.create(req.db, {
      name_courses,
      matrix_courses,
      course_icon_url,
    });

    res.status(201).json({
      id_courses: result.insertId,
      name_courses,
      matrix_courses,
      course_icon_url,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Esse curso já está cadastrado",
      });
    }

    console.error(err);

    res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name_courses, matrix_courses } = req.body;

    const existingCourse = await Course.findById(req.db, id);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Curso não encontrado",
      });
    }

    const course_icon_url = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : existingCourse.course_icon_url;

    await Course.update(req.db, id, {
      name_courses,
      matrix_courses,
      course_icon_url,
    });

    res.status(200).json({
      id_courses: id,
      name_courses,
      matrix_courses,
      course_icon_url,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao atualizar curso",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingCourse = await Course.findById(req.db, id);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Curso não encontrado",
      });
    }

    await Course.delete(req.db, id);

    res.status(200).json({
      message: "Curso excluído com sucesso",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao excluir curso",
    });
  }
  
});


module.exports = router;
