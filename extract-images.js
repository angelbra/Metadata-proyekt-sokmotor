const fs = require("fs");
const path = require("path");
const exifr = require("exifr");
const db = require("./backend/src/db");

async function extractImages() {
    const imagesFolder = path.join(__dirname, "images");
    const files = fs.readdirSync(imagesFolder);

    try {
        for (const file of files) {
            if (!/\.(jpg|jpeg|png)$/i.test(file)) {
                continue;
            }

            const filePath = path.join(imagesFolder, file);

            try {
                const metadata = await exifr.parse(filePath) || {};

                const [existing] = await db.query(
                    "SELECT id FROM images WHERE fileName = ? LIMIT 1",
                    [file]
                );

                if (existing.length > 0) {
                    console.log("Ya existe:", file);
                    continue;
                }

                await db.query(
                    "INSERT INTO images (fileName, metadata) VALUES (?, ?)",
                    [file, JSON.stringify(metadata)]
                );

                console.log("Guardado en MySQL:", file);

            } catch (error) {
                console.error("Error con", file, error.message);
            }
        }
    } finally {
        await db.end();
    }
}

extractImages().catch(console.error);