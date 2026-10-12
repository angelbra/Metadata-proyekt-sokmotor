const express = require("express");
const db = require("../db");

const router = express.Router();

// Buscar imágenes por nombre de archivo
router.get("/", async (req, res) => {
    try {
        const searchText = String(req.query.q || "").trim();

        const [results] = await db.query(
            `SELECT id, fileName, metadata
             FROM images
             WHERE fileName LIKE ?
             ORDER BY fileName ASC
             LIMIT 50`,
            [`%${searchText}%`]
        );

        res.json({
            total: results.length,
            results: results
        });

    } catch (error) {
        console.error("Error de búsqueda:", error.message);

        res.status(500).json({
            error: "No se pudo realizar la búsqueda"
        });
    }
});

module.exports = router;