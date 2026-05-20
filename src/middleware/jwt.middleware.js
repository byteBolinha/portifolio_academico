const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  if (process.env.SKIP_AUTH === "true") {
    const role = (process.env.MOCK_ROLE || "ADMIN").toUpperCase();

    const users = {
  ADMIN: {
    id: 1,
    roles_id: 1,
    role: "ADMIN",
    permissions: [
      "CRIAR_CURSO",
      "CRIAR_COMPETENCIA",
      "READ_ALL",
      "LIBERAR_CUSTOMIZACAO",
      "FLAG_PREENCHIDO",
      "FLAG_AVALIADO_COORD",
      "FLAG_AVALIADO_GESTAO",
      "FLAG_CANVAS_INTEGRATION",
      "MANAGE_LINKS_DRIVE",
      "MANAGE_PERMISSIONS",
      "CRIAR_TIPO_DE_DOCUMENTO",
      "DELET_DOCUMENT",
    ],
  },

  PROFESSOR: {
    id: 2,
    roles_id: 2,
    role: "PROFESSOR",
    permissions: [
      "READ_ALL",
      "FLAG_PREENCHIDO",
    ],
  },

  COORDINATOR: {
    id: 3,
    roles_id: 3,
    role: "COORDINATOR",
    permissions: [
      "READ_ALL",
      "CRIAR_COMPETENCIA",
      "FLAG_PREENCHIDO",
      "FLAG_AVALIADO_COORD",
    ],
  },

  NITE: {
    id: 4,
    roles_id: 4,
    role: "NITE",
    permissions: [
      "CRIAR_CURSO",
      "CRIAR_COMPETENCIA",
      "READ_ALL",
      "LIBERAR_CUSTOMIZACAO",
      "FLAG_PREENCHIDO",
      "FLAG_AVALIADO_COORD",
      "FLAG_AVALIADO_GESTAO",
      "FLAG_CANVAS_INTEGRATION",
      "MANAGE_LINKS_DRIVE",
      "CRIAR_TIPO_DE_DOCUMENTO",
    ],
  },
};

    req.user = users[role];

    console.log("USER MOCKADO:", req.user);

    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não foi fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "token invalido ou expirado!" });
  }
};

module.exports = Auth;
