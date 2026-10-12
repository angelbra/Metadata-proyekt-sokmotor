const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const searchText = String(req.query.q || "").trim();
        const artist = String(req.query.artist || "").trim();
        const minWidthText = String(req.query.minWidth || "").trim();

        let sql = `
            SELECT id, fileName, metadata
            FROM images
            WHERE (
                fileName LIKE ?
                OR CAST(metadata AS CHAR) LIKE ?
            )
        `;

        const searchPattern = `%${searchText}%`;
        const params = [searchPattern, searchPattern];

        if (artist) {
            sql += " AND metadata ->> '$.Artist' = ?";
            params.push(artist);
        }

        if (minWidthText !== "") {
            const minWidth = Number(minWidthText);

            if (!Number.isSafeInteger(minWidth) || minWidth < 0) {
                return res.status(400).json({
                    error: "Ogiltig bildbredd"
                });
            }

            sql += `
                AND CAST(
                    metadata ->> '$.ImageWidth' AS UNSIGNED
                ) >= ?
            `;

            params.push(minWidth);
        }

        sql += " ORDER BY fileName ASC LIMIT 50";

        const [results] = await db.query(sql, params);

        res.json({
            total: results.length,
            results: results
        });

    } catch (error) {
        console.error("Error de búsqueda:", error.message);

        res.status(500).json({
            error: "No se pudo realizar sökningen"
        });
    }
});

module.exports = router;