import chalk from "chalk";
import figlet from "figlet";
import asciify from "asciify-image";

console.log(chalk.green("Success: La operación se realizó correctamente."));
console.log(chalk.yellow("Warning: Revisa este dato antes de continuar."));
console.log(chalk.red("Error: Ocurrió un problema en el programa."));

figlet("Soy una Imagen", function (error, data) {
    if (error) {
        console.log(chalk.red("Error al generar texto ASCII"));
        return;
    }

    console.log(chalk.cyan(data));
});

const options = {
    fit: "box",
    width: 50,
    height: 30
};

asciify("extra.jpg", options, function (error, converted) {
    if (error) {
        console.log(chalk.red("Error al convertir la imagen."));
        console.log(error);
        return;
    }

    console.log(chalk.magenta(converted));
});