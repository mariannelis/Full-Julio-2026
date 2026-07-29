// Nivel 1 funciones// 
// Nivel 1.1
const logger = require("node-color-log");
let prompt = require("prompt-sync")();


logger.color("green", "Bienvenido al programa de funciones.").bgColor("black").log("Ejercicio 1: Mostrar números pares del 1 al 100");

function mostrarPares() {
  console.log("Números pares del 1 al 100:");
  for (let i = 2; i <= 100; i += 2) {
    console.log(i);
  }
}
mostrarPares();

// Nivel 1.2
function saludar(nombre) {
  logger.color("yellow", `Hola ${nombre}`);
}
let nombre = prompt("Introduce tu nombre:");
saludar(nombre);

// Nivel 1.3
function tablaMultiplicar(numero) {
  for (let i = 1; i <= 10; i++) {
    logger.color("cyan", `${numero} x ${i} = ${numero * i}`);
  }
}
let numero = parseInt(prompt("Introduce un número para ver su tabla de multiplicar:"));
tablaMultiplicar(numero);

// Nivel 1.4
logger.color("green", "¡Hola! Bienvenido al programa de funciones.");
function saludar(nombre) {
  logger.color("blue", `Hola ${nombre}`);
}

function procesarEntradaUsuario() {
  let nombre = prompt("Introduce tu nombre:");
  saludar(nombre);
}
procesarEntradaUsuario();

// Nivel 2 Validación y operaciones
// Nivel 2.1
function contieneLetraS(texto) {
  return texto.toLowerCase().includes("s");
}

let texto = prompt("Introduce una palabra o frase: ");
console.log(contieneLetraS(texto));


// Nivel 2.2
function parOImpar(numero) {
  if (numero % 2 === 0) {
    return "El número es par";
  } else {
    return "El número es impar";
  }
}

let numero1 = parseInt(prompt("Introduce un número para saber si es par o impar: "));
console.log(parOImpar(numero1));


// Nivel 2.3
function elevarASiMismo(numero) {
  return numero ** numero;
}

let numero2 = parseInt(prompt("Introduce un número para elevarlo a sí mismo: "));
console.log(`${numero2} elevado a sí mismo es: ${elevarASiMismo(numero2)}`);


// Nivel 2.4
function areaRectangulo(alto, ancho) {
  return alto * ancho;
}

let altoRectangulo = parseFloat(prompt("Introduce el alto del rectángulo: "));
let anchoRectangulo = parseFloat(prompt("Introduce el ancho del rectángulo: "));

console.log(`El área del rectángulo es: ${areaRectangulo(altoRectangulo, anchoRectangulo)}`);


// Nivel 2.5
function areaTrianguloRectangulo(alto, ancho) {
  return (alto * ancho) / 2;
}

let altoTriangulo = parseFloat(prompt("Introduce el alto del triángulo: "));
let anchoTriangulo = parseFloat(prompt("Introduce el ancho del triángulo: "));

console.log(`El área del triángulo rectángulo es: ${areaTrianguloRectangulo(altoTriangulo, anchoTriangulo)}`);


// Nivel 2.6
function areaCirculo(radio) {
  return Math.PI * radio ** 2;
}

let radio = parseFloat(prompt("Introduce el radio del círculo: "));

console.log(`El área del círculo es: ${areaCirculo(radio)}`);

// Nivel 3: Operaciones avanzadas
// Nivel 3.1
function elevarPotencia(base, exponente) {
  return base ** exponente;
}

let base = parseFloat(prompt("Introduce el número base: "));
let exponente = parseFloat(prompt("Introduce el exponente: "));

console.log(`${base} elevado a ${exponente} es: ${elevarPotencia(base, exponente)}`);


// Nivel 3.2
function mostrarFibonacci() {
  let numero1 = 0;
  let numero2 = 1;

  console.log("Primeros 10 números de la serie de Fibonacci:");

  for (let i = 1; i <= 10; i++) {
    console.log(numero1);

    let siguiente = numero1 + numero2;
    numero1 = numero2;
    numero2 = siguiente;
  }
}

mostrarFibonacci();




