const express = require("express");
const router = express.Router();

const Search = require("../models/search.model");

router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    const results = await Search.search(req.db, search);
    res.status(200).json(results);
  } catch (err) {
    console.error("Erro na rota de busca:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;