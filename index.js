const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./src/config/swagger')
const PORT = 3000;

const app = express();

const authRoutes = require('./src/routes/auth.routes')

const cors = require('cors');
app.use(cors());
app.use(express.json());
const injectDb = require('./src/middleware/db.middleware');
app.use(injectDb);
app.use('/auth', authRoutes);
const competencyRoutes = require('./src/routes/competency.routes');
const documentTypeRoutes = require('./src/routes/documentTypes.routes');
const academicDocumentsRoutes = require('./src/routes/academicDocuments.routes');
const userRoutes = require('./src/routes/users.routes')
const coursesRoutes = require('./src/routes/course.routes')

app.use('/courses', coursesRoutes)
app.use('/competency', competencyRoutes);
app.use('/document-types', documentTypeRoutes);
app.use('/academic-documents', academicDocumentsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRoutes);

app.listen(PORT, () =>{
    console.log(`servidor rodando na porta ${PORT}`);
})

app.use((err, req, res, next) => {
    console.error(err.stack);

    return res.status(500).json({
        error: 'Erro interno do servidor'
    });
});