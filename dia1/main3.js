// Nivel 1.3
function randonNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}   
console.log("El número aleatorio es: " + randonNumber(50, 500));
