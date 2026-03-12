const readline = require("readline");

function dibujar(x,y,caracter){

 readline. cursorTo(process.stdout,x,y);
 process.stdout.write(caracter);
}

module.exports = dibujar;