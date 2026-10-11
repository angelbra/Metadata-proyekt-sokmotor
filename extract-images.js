const fs = require("fs");
const path = require("path");
const exifr = require("exifr");

async function extractImages() {
    const imagesFolder = path.join(__dirname, "images");

    const files = fs.readdirSync(imagesFolder);

    for (const file of files) {
        if (!/\.(jpg|jpeg|png)$/i.test(file)) {
            continue;
        }

        const filePath = path.join(imagesFolder, file);

        try {
            const imageBuffer = fs.readFileSync(filePath);
            const metadata = await exifr.parse(imageBuffer);

            console.log("\nArchivo:", file);
            console.log("Metadatos:");
            console.log(JSON.stringify(metadata || {}, null, 2));

        } catch (error) {
            console.error("Error al leer:", file, error.message);
        }
    }
}

extractImages();