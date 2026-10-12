const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const searchText = String(req.query.q || "").trim();
        const artist = String(req.query.artist || "").trim();
        const minWidthText = String(req.query.minWidth || "").trim();
        const sort = String(req.query.sort || "asc").toLowerCase();

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

        // Filtrera efter Artist
        if (artist) {
            sql += " AND metadata ->> '$.Artist' = ?";
            params.push(artist);
        }

        // Filtrera efter minsta bildbredd
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

        // Sortera resultaten efter filnamn
        if (sort === "desc") {
            sql += " ORDER BY fileName DESC";
        } else {
            sql += " ORDER BY fileName ASC";
        }

        sql += " LIMIT 50";

        const [results] = await db.query(sql, params);

        res.json({
            total: results.length,
            results: results
        });

    } catch (error) {
        console.error("Sökfel:", error.message);

        res.status(500).json({
            error: "Kunde inte genomföra sökningen"
        });
    }
});

module.exports = router;