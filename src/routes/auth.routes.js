const express = require("express");
const router = express.Router();
const Auth = require("../middleware/jwt.middleware");
const requirePermissions = require("../middleware/requirePermission.middleware");
const AcademicDocuments = require("../models/academicDocuments.model");
const Competency = require("../models/competency.model");
const Notification = require("../models/notification.model");

router.post("/", Auth, requirePermissions('CRIAR_COMPETENCIA'), async (req, res) => {
  try {
    const {
      name_competency,
      course_id,
      code_competency,
      planner_link,
      teaching_plan_link,
      trimestre,
      matriz_competency,
    } = req.body;

    const competencyResult = await Competency.create(req.db, {
      name: name_competency,
      course_id,
      code_competency,
      matriz_competency,
    });

    const competencyId = competencyResult.insertId;

    await AcademicDocuments.create(req.db, {
      name: "Planner",
      competency_id: competencyId,
      documentType_id: 1,
      matriz_competency,
      trimestre,
      drive_link: planner_link,
    });

    await AcademicDocuments.create(req.db, {
      name: "Plano de Ensino",
      competency_id: competencyId,
      documentType_id: 2,
      matriz_competency,
      trimestre,
      drive_link: teaching_plan_link,
    });

    res.status(201).json({ message: "Competência criada com documentos" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;