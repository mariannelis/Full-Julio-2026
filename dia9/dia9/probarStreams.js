import fs from "fs";

const archivos = [
    "./archivos/pequeno.txt",
    "./archivos/mediano.txt",
    "./archivos/grande.txt"
];

const leerConStream = (ruta) => {
    return new Promise((resolve, reject) => {
        let cantidadChunks = 0;
        let totalBytes = 0;

        const stream = fs.createReadStream(ruta, {
            encoding: "utf8"
        });

        stream.on("data", (chunk) => {
            cantidadChunks++;
            totalBytes += Buffer.byteLength(chunk, "utf8");
        });

        stream.on("end", () => {
            console.log(`\nArchivo: ${ruta}`);
            console.log(`Chunks leídos: ${cantidadChunks}`);
            console.log(`Bytes procesados: ${totalBytes}`);
            resolve();
        });

        stream.on("error", (error) => {
            reject(error);
        });
    });
};

const ejecutarPrueba = async () => {
    try {
        for (const archivo of archivos) {
            await leerConStream(archivo);
        }

        console.log("\nPrueba de streams finalizada.");
    } catch (error) {
        console.error("Error al leer los archivos:", error.message);
    }
};

ejecutarPrueba();