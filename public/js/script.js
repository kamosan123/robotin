/*
	Script para lograr hacer vibrar el dispositivo en el modo control Manual
*/

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;


if (navigator.vibrate) {
    console.log('¡Puedes hacerlo vibrar!');
} else {
    console.log('No puedes hacerlo vibrar :');
}

function Vibrar() {
	console.log('Vibrar');
	navigator.vibrate(100000);
}

function StopVibrar() {
	console.log('Detener Vibrar');
	navigator.vibrate(0);
}