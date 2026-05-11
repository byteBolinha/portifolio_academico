const { z } = require('zod');

// Criamos um esquema rígido. Se o Front-end mandar um status que não está aqui, o Zod barra na hora.
const transicaoStatusSchema = z.object({
    novoStatus: z.enum([
        'EM_PREENCHIMENTO', 
        'AVALIACAO_COORDENACAO', 
        'AVALIACAO_GESTAO', 
        'MONTAGEM_ANALISTAS', 
        'PRONTO_CANVAS'
    ], {
        // Mensagem de erro customizada caso enviem um status maluco
        errorMap: () => ({ message: 'Status inválido fornecido.' })
    })
});

module.exports = { transicaoStatusSchema };