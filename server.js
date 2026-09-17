require('dotenv').config();

// Punto de entrada: inicia el servidor HTTP de la API.

const app = require('./src/app');

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    console.log(`API de tareas escuchando en http://localhost:${puerto}`);
});
