const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

router.post("/login", async (req, res) => {
  try {
    const { microsoft_id, email_users, name_users } = req.body;

    let user = await User.findByMicrosoftId(req.db, microsoft_id);

    if (!user) {
      await User.create(req.db, {
        microsoft_id,
        email_users,
        name_users,
        roles_id: 1, 
      });

      user = await User.findByMicrosoftId(req.db, microsoft_id);
    }

    const permissionsByRole = {
      1: [
        "CRIAR_CURSO",
        "CRIAR_COMPETENCIA",
        "READ_ALL",
        "FLAG_PREENCHIDO",
        "EM_PREENCHIMENTO",
        "NECESSITA_REVISAO",
        "FLAG_AVALIADO_COORD",
        "LIBERAR_CUSTOMIZACAO",
        "FLAG_CANVAS_INTEGRATION",
        "FLAG_AVALIADO_GESTAO",
        "MANAGE_LINKS_DRIVE",
        "MANAGE_PERMISSIONS",
        "CRIAR_TIPO_DE_DOCUMENTO",
        "DELET_DOCUMENT",
      ],

      2: [
        "CRIAR_CURSO",
        "CRIAR_COMPETENCIA",
        "READ_ALL",
        "FLAG_PREENCHIDO",
        "EM_PREENCHIMENTO",
        "NECESSITA_REVISAO",
        "FLAG_AVALIADO_COORD",
        "LIBERAR_CUSTOMIZACAO",
        "FLAG_CANVAS_INTEGRATION",
        "FLAG_AVALIADO_GESTAO",
        "MANAGE_LINKS_DRIVE",
      ],

      3: [
        "READ_ALL",
        "CRIAR_COMPETENCIA",
        "FLAG_PREENCHIDO",
        "EM_PREENCHIMENTO",
        "NECESSITA_REVISAO",
        "FLAG_AVALIADO_COORD",
      ],

      4: ["READ_ALL", "FLAG_PREENCHIDO", "EM_PREENCHIMENTO"],
    };

    const roleNames = {
      1: "ADMIN",
      2: "NITE",
      3: "COORDINATOR",
      4: "TEACHER",
    };

    const permissions = permissionsByRole[user.roles_id] || [];
    const role = roleNames[user.roles_id] || "TEACHER";

    const token = jwt.sign(
      {
        user_id: user.id_users,
        role_id: user.roles_id,
        email: user.email_users,
        permissions,
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id_users,
        name: user.name_users,
        email: user.email_users,
        role,
        permissions,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;