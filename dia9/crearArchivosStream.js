import fs from "fs";

fs.mkdirSync("./archivos", { recursive: true });

fs.writeFileSync(
    "./archivos/pequeno.txt",
    "Este es un archivo pequeño.\n".repeat(10)
);

fs.writeFileSync(
    "./archivos/mediano.txt",
    "Este es un archivo de tamaño mediano.\n".repeat(10000)
);

const streamGrande = fs.createWriteStream("./archivos/grande.txt");

for (let i = 0; i < 500000; i++) {
    streamGrande.write(
        `Línea ${i + 1}: contenido del archivo grande generado con Node.js.\n`
    );
}

streamGrande.end();

streamGrande.on("finish", () => {
    console.log("Los tres archivos fueron creados correctamente.");
});