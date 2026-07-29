import fs from "fs";

fs.readFile("archivos/mensaje.txt", "utf8", (error, contenido) => {
    if (error) {
        console.error("Error al leer el archivo:", error.message);
        return;
    }

    console.log("Contenido del archivo:");
    console.log(contenido);
});