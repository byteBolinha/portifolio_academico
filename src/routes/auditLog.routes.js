const express = require('express');
const router = express.Router();
const Auth = require('../middleware/jwt.middleware');
const requirePermissions = require('../middleware/requirePermission.middleware');
const AuditLog = require('../models/auditLog.model');

function parsePagination(query) {
  const limit  = Math.min(parseInt(query.limit  || '50',  10), 500);
  const offset = Math.max(parseInt(query.offset || '0',   10), 0);
  return { limit, offset };
}

// GET /audit-logs
router.get('/', Auth, requirePermissions('READ_ALL'), async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const logs = await AuditLog.findAll(req.db, { limit, offset });
    return res.status(200).json({ logs, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar logs.' });
  }
});

// GET /audit-logs/documents/validations
router.get('/documents/validations', Auth, requirePermissions('READ_ALL'), async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const logs = await AuditLog.findDocumentValidationLogs(req.db, { limit, offset });
    return res.status(200).json({ logs, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar logs de validação.' });
  }
});

// GET /audit-logs/documents/:document_id
router.get('/documents/:document_id', Auth, requirePermissions('READ_ALL'), async (req, res) => {
  try {
    const logs = await AuditLog.findByDocument(req.db, req.params.document_id);
    return res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar logs do documento.' });
  }
});

// GET /audit-logs/users/:user_id
router.get('/users/:user_id', Auth, requirePermissions('MANAGE_PERMISSIONS'), async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const logs = await AuditLog.findByUser(req.db, req.params.user_id, { limit, offset });
    return res.status(200).json({ logs, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar logs do usuário.' });
  }
});

// GET / audit-logs/actions/ :action
router.get('/action/:action', Auth, requirePermissions('READ_ALL'), async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const logs = await AuditLog.findByAction(req.db, req.params.action, { limit, offset });
    return res.status(200).json({ logs, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar logs por ação.' });
  }
});

module.exports = router;