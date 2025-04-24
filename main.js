import { inditIdozito, inditJatekot, torolIdozito } from './feladatok.js';

function inditas() {
  torolIdozito();
  inditIdozito();
  inditJatekot();
}

window.addEventListener("load", inditas);
document.getElementById("ujra").addEventListener("click", inditas);