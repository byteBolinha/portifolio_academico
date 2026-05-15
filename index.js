const express = require('express');
const connectDB = require('./src/config/db')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./src/config/swagger')
const PORT = 3000;

const app = express();

const authRoutes = require('./src/routes/auth.routes')

app.use(express.json());
const injectDb = require('./src/middleware/db.middleware');
app.use(injectDb);
app.use('/auth', authRoutes);
const competencyRoutes = require('./src/routes/competency.routes');
const documentTypeRoutes = require('./src/routes/documentTypes.routes');
const academicDocumentsRoutes = require('./src/routes/academicDocuments.routes');

app.use('/competency', competencyRoutes);
app.use('/document-types', documentTypeRoutes);
app.use('/academic-documents', academicDocumentsRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT, () =>{
    console.log(`servidor rodando na porta ${PORT}`);
})


