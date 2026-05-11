const PlannerModel = require('../models/planner.model');

class PlannerService {
    
    // Gerencia a transição de status do planner.
    static async alterarStatus(db, documentId, novoStatus, roleId) {
        const documento = await PlannerModel.getById(db, documentId);

        if (!documento) {
            throw new Error('Documento não encontrado no sistema.');
        }

        const statusAtual = documento.status_atual;

        // Analistas (Admin - Role 1) ignoram todas as travas.
        if (roleId === 1) {
            await PlannerModel.updateStatus(db, documentId, novoStatus);
            return novoStatus;
        }

        // Qualquer gestor/coord pode devolver para preenchimento.
        if (novoStatus === 'EM_PREENCHIMENTO') {
            if (roleId !== 3 && roleId !== 2) {
                throw new Error('Acesso negado: Apenas coordenadores ou analistas podem solicitar correções.');
            }
        } 
        
        else if (statusAtual === 'EM_PREENCHIMENTO') {
            if (novoStatus !== 'AVALIACAO_COORDENACAO') {
                throw new Error('O planner deve ser enviado obrigatoriamente para a Coordenação.');
            }
            if (roleId !== 4 && roleId !== 3) {
                throw new Error('Acesso negado: Apenas o professor responsável pode concluir esta etapa.');
            }
        } 
        
        else if (statusAtual === 'AVALIACAO_COORDENACAO') {
            if (novoStatus !== 'AVALIACAO_GESTAO') {
                throw new Error('O planner deve seguir para a Gestão Acadêmica após a coordenação.');
            }
            if (roleId !== 3) {
                throw new Error('Acesso negado: Apenas o coordenador pode validar esta etapa.');
            }
        }

        // Se passou pelas regras, salva.
        await PlannerModel.updateStatus(db, documentId, novoStatus);
        return novoStatus;
    }
}

module.exports = PlannerService;