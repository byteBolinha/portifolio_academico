const express = require('express');
const router = express.Router();
const Auth = require('../middleware/jwt.middleware');
const AcademicDocuments = require('../models/academicDocuments.model');
const requirePermissions = require('../middleware/requirePermission.middleware');
const Competency = require('../models/competency.model');

router.post("/", async (req, res) => {
  try {

    const {
      name_competency,
      course_id,
      code_competency,

      planner_link,
      teaching_plan_link,

      trimestre,
      matriz,
    } = req.body;

   
    const competencyResult = await Competency.create(req.db, {
      name: name_competency,
      course_id,
      code_competency,
    });

    const competencyId = competencyResult.insertId;

  
    await AcademicDocuments.create(req.db, {
      name: "Planner",
      competency_id: competencyId,
      documentType_id: 1,
      matriz,
      trimestre,
      drive_link: planner_link,
    });


    await AcademicDocuments.create(req.db, {
      name: "Plano de Ensino",
      competency_id: competencyId,
      documentType_id: 2,
      matriz,
      trimestre,
      drive_link: teaching_plan_link,
    });

    res.status(201).json({
      message: "Competência criada com documentos",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

router.get('/competency/:competency_id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    try {
        const results = await AcademicDocuments.findByCompetency(req.db, req.params.competency_id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
    try {
        const result = await AcademicDocuments.findById(req.db, req.params.id);
        if (!result) return res.status(404).json({ message: "Documento não encontrado." });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/flag/customizar', Auth, requirePermissions('LIBERAR_CUSTOMIZACAO'), async (req, res) => {
    try {
        const { status } = req.body;
        await AcademicDocuments.updateFlagLiberadoCustomizar(req.db, req.params.id, status);
        res.status(200).json({ message: "Status de customização atualizado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/flag/preenchido', Auth, requirePermissions('FLAG_PREENCHIDO'), async (req, res) => {
    try {
        const { status } = req.body;
        await AcademicDocuments.updateFlagPreenchido(req.db, req.params.id, status);
        res.status(200).json({ message: "Status de preenchimento atualizado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/flag/coordenacao', Auth, requirePermissions('FLAG_AVALIADO_COORD'), async (req, res) => {
    try {
        const { status } = req.body;
        await AcademicDocuments.updateFlagValidacaoCoordenacao(req.db, req.params.id, status);
        res.status(200).json({ message: "Validação da coordenação atualizada." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/flag/gestao', Auth, requirePermissions('FLAG_AVALIADO_GESTAO'), async (req, res) => {
    try {
        const { status } = req.body;
        await AcademicDocuments.updateFlagIntegradoRM(req.db, req.params.id, status);
        res.status(200).json({ message: "Status de gestão (RM) atualizado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/flag/canvas', Auth, requirePermissions('FLAG_CANVAS_INTEGRATION'), async (req, res) => {
    try {
        const { status } = req.body;
        await AcademicDocuments.updateFlagDisponivelCanva(req.db, req.params.id, status);
        res.status(200).json({ message: "Status Canva atualizado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/trimestre', async (req, res) => {
    try {

      

        const { trimestre } = req.body;

        const result = await AcademicDocuments.updateTrimestre(
            req.db,
            req.params.id,
            trimestre
        );

        console.log(result);

        res.status(200).json({
            message: "Trimestre atualizado."
        });

    } catch (err) {

        console.error("ERRO REAL:");
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


router.patch('/:id/drive-link', Auth, requirePermissions('MANAGE_LINKS_DRIVE'), async (req, res) => {
    try {
        const { link } = req.body;
        await AcademicDocuments.updateDriveLink(req.db, req.params.id, link);
        res.status(200).json({ message: "Link do Drive atualizado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', Auth, requirePermissions('DELET_DOCUMENT'), async (req, res) => {
    try {
        const success = await AcademicDocuments.deletById(req.db, req.params.id);
        if (!success) return res.status(404).json({ message: "Documento não encontrado." });
        res.status(200).json({ message: "Documento removido." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;