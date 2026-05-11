const PlannerService = require('../services/planner.service');
// Importa o schema
const { transicaoStatusSchema } = require('../validations/planner.schema');

const atualizarStatus = async (req, res) => {
    try {
        const documentId = req.params.id; 
        
        // O método .parse() analisa o req.body. 
        // Se estiver tudo certo, ele devolve os dados limpos.
        // Se o Front-end mandou algo errado (ex: "STATUS_BATATA"), o Zod dispara um erro e cai direto no 'catch' abaixo.
        const dadosValidados = transicaoStatusSchema.parse(req.body);

        const roleId = req.user.role_id;

        // Passa a propriedade 'novoStatus' já validada pelo Zod para o Service
        const statusAtualizado = await PlannerService.avancarStatus(
            req.db, 
            documentId, 
            dadosValidados.novoStatus, 
            roleId
        );

        return res.status(200).json({ 
            sucesso: true,
            mensagem: 'Status atualizado com sucesso!', 
            status: statusAtualizado 
        });

    } catch (erro) {
        // Tratamento do erro: Verifica se o erro veio do Zod ou do nosso Service
        if (erro.name === 'ZodError') {
            // Se foi o Zod que barrou, devolvemos o erro formatado
            return res.status(400).json({ 
                sucesso: false,
                mensagem: 'Erro de validação nos dados enviados.',
                detalhes: erro.errors.map(e => e.message)
            });
        }

        // Se foi erro de regra de negócio (ex: "Acesso Negado"), devolve a mensagem normal
        return res.status(400).json({ 
            sucesso: false,
            mensagem: erro.message 
        });
    }
};

module.exports = { atualizarStatus };