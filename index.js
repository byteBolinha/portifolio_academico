const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./src/config/swagger')
const PORT = 3000;

const app = express();

const authRoutes = require('./src/routes/auth.routes')

app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173" 
}));
const injectDb = require('./src/middleware/db.middleware');
app.use(injectDb);
app.use('/auth', authRoutes);
const competencyRoutes = require('./src/routes/competency.routes');
const documentTypeRoutes = require('./src/routes/documentTypes.routes');
const academicDocumentsRoutes = require('./src/routes/academicDocuments.routes');
const userRoutes = require('./src/routes/users.routes')
const coursesRoutes = require('./src/routes/course.routes')
const searchRoutes = require("./src/routes/search.routes");
const notificationRoutes = require("./src/routes/notification.routes");

app.use('/courses', coursesRoutes)
app.use('/competency', competencyRoutes);
app.use('/document-types', documentTypeRoutes);
app.use('/academic-documents', academicDocumentsRoutes);
app.use("/courses", coursesRoutes);
app.use("/search", searchRoutes);
app.use("/notifications", notificationRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRoutes);

app.listen(PORT, () =>{
    console.log(`servidor rodando na porta ${PORT}`);
});


