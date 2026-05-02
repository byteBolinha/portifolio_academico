const express = require('express');
const connectDB = require('./src/config/db')
// const swaggerUi = require('swagger-ui-express')
// const swaggerSpec = require('./src/config/swagger')
const PORT = 3000;

const app = express();

const authRoutes = require('./src/routes/auth.routes')

app.use(express.json());
const injectDb = require('./src/middleware/db.middleware');
app.use(injectDb);
app.use('/auth', authRoutes);


app.listen(PORT, () =>{
    console.log(`servidor rodando na porta ${PORT}`);
})


