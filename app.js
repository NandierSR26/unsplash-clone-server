const express = require('express');
const fileUpload = require('express-fileupload');
const { dbConecction } = require('./db/config');
const cors = require('cors')
require('dotenv').config({ path: '.env' });

const app = express();
const port = process.env.PORT

dbConecction();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_2, 'http://localhost:5173'];

app.use(cors({ origin: whitelist }))
app.use(express.json())
app.use(express.static('public'))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
    createParentPath: true
}));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pictures', require('./routes/pictures.routes'));
app.use('/api/users', require('./routes/users.routes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})