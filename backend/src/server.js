require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const searchRoutes = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Conectar las rutas de búsqueda
app.use("/api/search", searchRoutes);

// Mostrar nuestra página HTML
app.use(express.static(
    path.join(__dirname, "../../public")
));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});