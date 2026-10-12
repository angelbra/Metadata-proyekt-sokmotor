const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const searchText = String(req.query.q || "").trim();
        const artist = String(req.query.artist || "").trim();

        const [results] = await db.query(
            `SELECT id, fileName, metadata
             FROM images
             WHERE fileName LIKE ?
             AND (
                 ? = ''
                 OR metadata ->> '$.Artist' = ?
             )
             ORDER BY fileName ASC
             LIMIT 50`,
            [`%${searchText}%`, artist, artist]
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