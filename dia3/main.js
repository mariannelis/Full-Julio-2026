// Nivel 1: Operaciones básicas con arrays
let frutasNivel1 = [
    "manzana",
    "banana",
    "pera",
    "uva",
    "mango",
    "fresa",
    "kiwi",
    "naranja",
    "sandía",
    "piña"
];

console.log("Array original:");
console.log(frutasNivel1);

console.log("Elemento en la posición 3:");
console.log(frutasNivel1[3]);

console.log("Elemento en la posición 6:");
console.log(frutasNivel1[6]);

console.log("Longitud del array:");
console.log(frutasNivel1.length);

frutasNivel1.unshift("cereza");

console.log("Array después de añadir un valor al inicio:");
console.log(frutasNivel1);

frutasNivel1.push("melón");

console.log("Array después de añadir un valor al final:");
console.log(frutasNivel1);

frutasNivel1.splice(5, 2);

console.log("Array después de eliminar los elementos de las posiciones 5 y 6:");
console.log(frutasNivel1);

let valorBuscadoNivel1 = "kiwi";

console.log(`La posición de ${valorBuscadoNivel1} es:`);
console.log(frutasNivel1.indexOf(valorBuscadoNivel1));

frutasNivel1.reverse();

console.log("Array invertido:");
console.log(frutasNivel1);

let frutasString = frutasNivel1.join(",");

console.log("Array convertido en string:");
console.log(frutasString);

let arrayDesdeString = frutasString.split(",");

console.log("String convertido nuevamente en array:");
console.log(arrayDesdeString);


// Nivel 2: Recorrer, modificar y buscar
let frutasNivel2 = [
    "manzana",
    "banana",
    "pera",
    "uva",
    "mango",
    "fresa",
    "kiwi",
    "naranja",
    "sandía",
    "piña"
];

console.log("\nNivel 2.1 - Valores del array con su posición:");

for (let i = 0; i < frutasNivel2.length; i++) {
    console.log(`Índice ${i}: ${frutasNivel2[i]}`);
}

console.log("\nNivel 2.2 - Array modificado:");

for (let i = 0; i < frutasNivel2.length; i++) {
    frutasNivel2[i] = frutasNivel2[i] + " deliciosa";
    console.log(`Índice ${i}: ${frutasNivel2[i]}`);
}

console.log("\nNivel 2.3 - Buscar un valor en el array:");

let valorBuscadoNivel2 = "pera deliciosa";

let existe = frutasNivel2.includes(valorBuscadoNivel2);
console.log(`¿Existe "${valorBuscadoNivel2}" en el array? ${existe}`);

let posicion = frutasNivel2.indexOf(valorBuscadoNivel2);
console.log(`La posición de "${valorBuscadoNivel2}" es: ${posicion}`);

console.log("\nNivel 2.4 - Filtrar elementos del array:");

let frutasConLetraA = frutasNivel2.filter(function (fruta) {
    return fruta.includes("a");
});

console.log("Frutas que contienen la letra 'a':");
console.log(frutasConLetraA);


// Nivel 3: Desestructuración y Spread Syntax
let frutasNivel3 = [
    "manzana",
    "banana",
    "pera",
    "uva",
    "mango",
    "fresa",
    "kiwi",
    "naranja",
    "sandía",
    "piña"
];

let [
    fruta1,
    fruta2,
    fruta3,
    fruta4,
    fruta5,
    fruta6,
    fruta7,
    fruta8,
    fruta9,
    fruta10
] = frutasNivel3;

console.log("\nNivel 3.1 - Desestructuración:");

console.log("Fruta 1:");
console.log(fruta1);

console.log("Fruta 2:");
console.log(fruta2);

console.log("Fruta 3:");
console.log(fruta3);

console.log("Fruta 4:");
console.log(fruta4);

console.log("Fruta 5:");
console.log(fruta5);

console.log("Fruta 6:");
console.log(fruta6);

console.log("Fruta 7:");
console.log(fruta7);

console.log("Fruta 8:");
console.log(fruta8);

console.log("Fruta 9:");
console.log(fruta9);

console.log("Fruta 10:");
console.log(fruta10);


//Spread Syntax - copiar array
let copiaFrutas = [...frutasNivel3];

console.log("\nCopia del array frutas:");
console.log(copiaFrutas);


// Spread Syntax - combinar arrays
let verdurasNivel3 = ["zanahoria", "lechuga", "tomate"];

let frutasYVerdurasNivel3 = [...frutasNivel3, ...verdurasNivel3];

console.log("Array combinado de frutas y verduras:");
console.log(frutasYVerdurasNivel3);


// Spread Syntax - agregar elementos al inicio y al final
let nuevoArrayNivel3 = ["cereza", ...frutasNivel3, "melón"];

console.log("Array con elementos agregados al inicio y al final:");
console.log(nuevoArrayNivel3);


//Copiar array y modificar solo la copia
let frutasModificadas = [...frutasNivel3];

frutasModificadas.push("durazno");

console.log("Array original:");
console.log(frutasNivel3);

console.log("Array modificado:");
console.log(frutasModificadas);

//Combinar arrays de números
let numeros1 = [1, 2, 3];
let numeros2 = [4, 5, 6];

let numerosCombinados = [...numeros1, ...numeros2];

console.log("Números combinados:");
console.log(numerosCombinados);