const express = require("express");
const router = express.Router();
const Auth = require("../middleware/jwt.middleware");
const AcademicDocuments = require("../models/academicDocuments.model");
const requirePermissions = require("../middleware/requirePermission.middleware");
const Competency = require("../models/competency.model");
const Notification = require("../models/notification.model");
const auditLog = require('../middleware/auditLog.middleware');

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
      matriz: matriz_competency,
      trimestre,
      drive_link: planner_link,
    });

    await AcademicDocuments.create(req.db, {
      name: "Plano de Ensino",
      competency_id: competencyId,
      documentType_id: 2,
      matriz: matriz_competency,
      trimestre,
      drive_link: teaching_plan_link,
    });

    res.status(201).json({ message: "Competência criada com documentos" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get(
  "/competency/:competency_id",
  Auth,
  requirePermissions("READ_ALL"),
  async (req, res) => {
    try {
      const results = await AcademicDocuments.findByCompetency(
        req.db,
        req.params.competency_id,
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.get("/:id", Auth, requirePermissions("READ_ALL"), async (req, res) => {
  try {
    const result = await AcademicDocuments.findById(req.db, req.params.id);
    if (!result)
      return res.status(404).json({ message: "Documento não encontrado." });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch(
  "/:id/flag/customizar",
  Auth,
  requirePermissions("LIBERAR_CUSTOMIZACAO"),
  auditLog('FLAG_LIBERADO_CUSTOMIZAR', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagLiberadoCustomizar(
        req.db,
        req.params.id,
        status,
      );

      const document = await AcademicDocuments.findById(req.db, req.params.id);

      await Notification.create(req.db, {
        competency_id: document.competency_id,
        document_id: document.id_academicD,
        title: "Customização liberada",
        message: `${document.name_academicD} foi liberado para customização.`,
      });

      res.status(200).json({
        message: "Status de customização atualizado.",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.patch(
  "/:id/flag/preenchido",
  Auth,
  requirePermissions("FLAG_PREENCHIDO"),
  auditLog('FLAG_PREENCHIDO', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagPreenchido(
        req.db,
        req.params.id,
        status,
      );

      const document = await AcademicDocuments.findById(req.db, req.params.id);

      await Notification.create(req.db, {
        competency_id: document.competency_id,
        document_id: document.id_academicD,
        title: "Documento preenchido",
        message: `${document.name_academicD} foi marcado como preenchido.`,
      });

      res.status(200).json({
        message: "Status de preenchimento atualizado.",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.patch(
  "/:id/flag/coordenacao",
  Auth,
  requirePermissions("FLAG_AVALIADO_COORD"),
  auditLog('FLAG_VALIDACAO_COORDENACAO', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagValidacaoCoordenacao(
        req.db,
        req.params.id,
        status,
      );

      const document = await AcademicDocuments.findById(req.db, req.params.id);

      await Notification.create(req.db, {
        competency_id: document.competency_id,
        document_id: document.id_academicD,
        title: "Documento validado pela coordenação",
        message: `${document.name_academicD} foi validado pela coordenação.`,
      });

      res.status(200).json({
        message: "Validação da coordenação atualizada.",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.patch(
  "/:id/flag/gestao",
  Auth,
  requirePermissions("FLAG_AVALIADO_GESTAO"),
  auditLog('FLAG_AVALIADO_GESTAO', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagIntegradoRM(
        req.db,
        req.params.id,
        status,
      );

      res.status(200).json({
        message: "Status de gestão (RM) atualizado.",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.patch("/:id/trimestre", async (req, res) => {
  try {
    const { trimestre } = req.body;

    const result = await AcademicDocuments.updateTrimestre(
      req.db,
      req.params.id,
      trimestre,
    );
    res.status(200).json({
      message: "Trimestre atualizado.",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.patch(
  "/:id/drive-link",
  Auth,
  requirePermissions("MANAGE_LINKS_DRIVE"),
  async (req, res) => {
    try {
      const { link } = req.body;
      await AcademicDocuments.updateDriveLink(req.db, req.params.id, link);
      res.status(200).json({ message: "Link do Drive atualizado." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.patch("/:id", async (req, res) => {
  try {
    const { name_competency, course_id, code_competency } = req.body;

    await Competency.update(req.db, {
      id: req.params.id,
      name: name_competency,
      course_id,
      code_competency,
    });

    res.status(200).json({ message: "Competência atualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/documents", async (req, res) => {
  try {
    const { planner_link, teaching_plan_link, trimestre } = req.body;

    await AcademicDocuments.updateByCompetencyAndType(
      req.db,
      req.params.id,
      1,
      {
        drive_link: planner_link,
        trimestre,
      },
    );

    await AcademicDocuments.updateByCompetencyAndType(
      req.db,
      req.params.id,
      2,
      {
        drive_link: teaching_plan_link,
        trimestre,
      },
    );

    res.status(200).json({ message: "Documentos atualizados" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch(
  '/:id/flag/necessita-revisao',
  Auth,
  requirePermissions('NECESSITA_REVISAO'),
  auditLog('FLAG_NECESSITA_REVISAO', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagNecessitaRevisao(
        req.db,
        req.params.id,
        status
      );

      if (status) {
        const document = await AcademicDocuments.findById(
          req.db,
          req.params.id
        );

        await Notification.create(req.db, {
          competency_id: document.competency_id,
          document_id: document.id_academicD,
          title: "Documento necessita revisão",
          message: `${document.name_academicD} foi marcado como necessitando revisão.`,
        });
      }

      res.status(200).json({
        message: "Status de revisão atualizado."
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

router.patch(
  "/:id/flag/em-preenchimento",
  Auth,
  requirePermissions("EM_PREENCHIMENTO"),
  auditLog('FLAG_EM_PREENCHIMENTO', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagEmPreenchimento(
        req.db,
        req.params.id,
        status,
      );

      const document = await AcademicDocuments.findById(req.db, req.params.id);

      await Notification.create(req.db, {
        competency_id: document.competency_id,
        document_id: document.id_academicD,
        title: "Documento em preenchimento",
        message: `${document.name_academicD} entrou em preenchimento.`,
      });

      res.status(200).json({
        message: "Status em preenchimento atualizado.",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.patch(
  "/:id/flag/canvas",
  Auth,
  requirePermissions("FLAG_CANVAS_INTEGRATION"),
  auditLog('FLAG_CANVAS_INTEGRATION', 'academic_documents'),
  async (req, res) => {
    try {
      const { status } = req.body;

      await AcademicDocuments.updateFlagDisponivelCanva(
        req.db,
        req.params.id,
        status,
      );

      const document = await AcademicDocuments.findById(req.db, req.params.id);

      await Notification.create(req.db, {
        competency_id: document.competency_id,
        document_id: document.id_academicD,
        title: "Documento disponível no Canvas",
        message: `${document.name_academicD} foi disponibilizado no Canvas.`,
      });

      res.status(200).json({
        message: "Status Canva atualizado.",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
);

router.delete(
  "/competency/:id",
  Auth,
  requirePermissions("DELET_DOCUMENT"),
  async (req, res) => {
    try {
      const result = await Competency.delete(req.db, req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Competência não encontrada.",
        });
      }

      return res.status(200).json({
        message: "Competência removida.",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },
);

module.exports = router;
