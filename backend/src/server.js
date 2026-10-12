require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Permitir solicitudes desde nuestra página web
app.use(cors());
app.use(express.json());

// Ruta de prueba para comprobar el servidor
app.get("/", (req, res) => {
    res.json({
        message: "Metadata Search Engine API",
        status: "OK"
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});