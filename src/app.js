// Configura la aplicación Express sin iniciar todavía el servidor HTTP.

const express = require('express');
const cors = require('cors');
const tareasRoutes = require('./routes/tareas.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors()); // Permitir peticiones desde cualquier origen

// Permite interpretar los cuerpos de las peticiones con formato JSON.
app.use(express.json());

app.use('/auth', authRoutes);

// Registra todas las rutas de tareas bajo el prefijo /tareas.
app.use('/tareas', tareasRoutes);
app.use('/categorias', categoriasRoutes);

// Respuesta para rutas que no existen.
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Maneja errores de JSON mal formado y otros errores no controlados.
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
        return res.status(400).json({ mensaje: 'El cuerpo debe contener un JSON válido.' });
    }

    console.error(error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

module.exports = app;
