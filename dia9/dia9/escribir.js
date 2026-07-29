import fs from "fs";

const mensaje = "Hola, este archivo fue creado con Node.js.";

fs.writeFile("archivos/mensaje.txt", mensaje, "utf8", (error) => {
    if (error) {
        console.error("Error al escribir el archivo:", error.message);
        return;
    }

    console.log("Archivo creado correctamente.");
});