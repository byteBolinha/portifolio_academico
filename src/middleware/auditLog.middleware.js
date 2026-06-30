const AuditLog = require('../models/auditLog.model');
const AcademicDocuments = require('../models/academicDocuments.model');

const auditLog = (action, entity, options = {}) => {
  return async (req, res, next) => {
    const entityId = req.params?.id ? parseInt(req.params.id, 10) : null;

    // Captura o estado ANTES do update rodar
    let oldValue = null;
    if (entity === 'academic_documents' && entityId && options.captureOldValue !== false) {
      try {
        oldValue = await AcademicDocuments.findById(req.db, entityId);
      } catch (_) {}
    }

    // Intercepta res.json para saber quando a rota terminou
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      originalJson(body);

      // Só loga em respostas de sucesso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setImmediate(async () => {
          try {
            const user = req.user;
            if (!user) return;

            const description =
              options.description ||
              `Usuário "${user.name || user.email || user.user_id}" realizou "${action}" em ${entity}${entityId ? ` #${entityId}` : ''}.`;

            await AuditLog.create(req.db, {
              user_id:   user.user_id || user.id,
              user_name: user.name || user.email || String(user.user_id || user.id),
              user_role: user.role || String(user.role_id),
              action,
              entity,
              entity_id: entityId,
              old_value: oldValue,
              new_value: req.body,
              description,
              ip_address:
                req.headers['x-forwarded-for'] ||
                req.socket?.remoteAddress ||
                null,
            });
          } catch (err) {
            console.error('[AuditLog Middleware] Erro ao registrar log:', err);
          }
        });
      }
    };

    next();
  };
};

module.exports = auditLog;