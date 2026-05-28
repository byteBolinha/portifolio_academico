const express = require('express');
const router = express.Router();

const Notification = require('../models/notification.model');
const AcademicDocuments = require('../models/academicDocuments.model');

router.get("/", async (req, res) => {
  try {

    const notifications =
      await Notification.findAll(req.db);

    res.status(200).json(notifications);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

router.get("/course/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const notifications = await Notification.findByCourse(
      req.db,
      id
    );

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Notification.delete(
      req.db,
      req.params.id
    );

    res.json({
      message: "Notificação deletada com sucesso",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao deletar notificação",
    });
  }
});


module.exports = router;