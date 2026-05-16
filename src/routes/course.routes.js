const express = require("express");
const router = express.Router();

const Course = require("../models/course.model");


router.get("/", async (req, res) => {
  try {
    const results = await Course.findAll(req.db);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  const { name_courses, launch_date_courses, course_icon_url } = req.body;

  try {
    const result = await Course.create(req.db, {
      name_courses,
      launch_date_courses,
      course_icon_url,
    });

    res.status(201).json({
      id: result.insertId,
      message: "Curso criado com sucesso",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;