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


module.exports = router;