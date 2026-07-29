import fs from "fs";

fs.unlink("./archivos/mensaje.txt", (error) => {
    if (error) {
        console.error("Error al eliminar el archivo:", error.message);
        return;
    }

    console.log("Archivo eliminado correctamente.");
});