//Variable de tipo Sokect.io con la cual se realiza la conexion cliente -  servidor
var websocket = io.connect("");

//Variables del DOM (Document Object Model HTML) y variables de retorno Giroscopio
var elem = document.getElementById("contenido"),
	divLeft = document.getElementById("direccionLeft"),
	divRight = document.getElementById("direccionRight"),
	alpha = "Sin acciones",
	gamma = "Sin acciones";

/*
	Funcion para agregar el evento click a todo el contenido, con el fin de apliar la pantalla a fullscreen
	luego de que se oprima en cualquier parte de la pantalla.
*/
elem.addEventListener('click', fullscreen, false);

function fullscreen(){
	if (elem.requestFullscreen) {
	  elem.requestFullscreen();
	} else if (elem.msRequestFullscreen) {
	  elem.msRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
	  elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
	  elem.webkitRequestFullscreen();
	}

}

//Funcion para optener los grados de moviemiento del dispositivo dados por el giroscopio
 window.addEventListener("deviceorientation", function(event) {
          // process event.alpha, event.beta and event.gamma
          /*
          	Define los rangos para las direcciones Izquierda y Derecha
			Teniendo en cuenta que alpha devuelve valores entre 0° y 360°
			Se tiene entonces lo siguiente: 
				- No se realizan acciones entre el rango de 0° a 45° o de 325° a 360°
				- Se va hacia la Izquierda si se pasa de 46° y se va hasta 180°
				- Se va hacia la Derecha si se pasa de 181° y se va hasta 326°
          */
          if((event.alpha >= 0 && event.alpha <= 45) || (event.alpha <= 360 && event.alpha >= 325)){
          	alpha = "Sin acciones";
          }else if(event.alpha >= 46 && event.alpha <= 180){
          	alpha = "Izquierda";
          }else if(event.alpha <= 326 && event.alpha >= 181){
          	alpha = "Derecha";
          }

          /*
          	Define los rangos para las direcciones Adelante y Atrás
			Teniendo en cuenta que gama devuelve valores entre -0° y -90° 
			para mayor comodidad los valores se toman como positivos multiplicando por -1
			Se tiene entonces lo siguiente: 
				- No se realizan acciones entre el rango de 71° a 89°
				- Se va hacia Adelante si se pasa de 1° y se va hasta 70°
				- Se va hacia la Atras si se pasa de -10°
          */
          if(event.gamma * -1 >= 1 && event.gamma * -1 <= 70){
          	gamma = "Adelante";
          }else if(event.gamma *-1 >= 71 && event.gamma *-1  <= 89){
          	gamma = "Sin acciones";
          }else if(event.gamma * -1 < -10){
          	gamma = "Atras";
          }

          /*
			Debido a que el robot solo puede realizar una accion a la vez se hace necesario
			convertir los multiples resultados a una sola accion así: 
				- Si alpha arroja Izquierda y gamma devulve Sin acciones entonces 
				  se ejecuta la acción de ir hacia la Izquierda
				- Si alpha arroja Derecha y gamma devulve Sin acciones entonces 
				  se ejecuta la acción de ir hacia la Derecha
				- Si gamma arroja Adelante y alpha devuleve Sin acciones entonces 
				  se ejecuta la acción de ir hacia Adelante
				- Si gamma arroja Sin acciones y alpha devuleve Sin acciones entonces 
				  se ejecuta la acción de Detener los motores
				- Si gamma arroja Atras y apha devuelve Izquierda se ejecuta la acción
				  de ir hacia atrás, esto es asi debido a que al pasar los -10° el giroscopio
				  tambien detecta más de 45 grados en alpha y no logra devolver "Sin acciones"
				  pero se soluciona comparando con Izquierda 

          */
          if(alpha === "Izquierda" && gamma === "Sin acciones"){
          	divLeft.innerHTML = divRight.innerHTML = "<b>Izquierda</b>";
          	direccion(1);
          }else if(alpha === "Derecha" && gamma === "Sin acciones"){
			divLeft.innerHTML = divRight.innerHTML  = "<b>Derecha</b>";
			direccion(2);
          }else if(gamma === "Adelante" && alpha === "Sin acciones"){
          	divLeft.innerHTML = divRight.innerHTML  = "<b>Adelante</b>";
          	direccion(3);
          }else if(gamma === "Sin acciones" && alpha === "Sin acciones"){
          	divLeft.innerHTML = divRight.innerHTML = "<b>Detener</b>";
          	direccion(4);
          }else if(gamma === "Atras" && alpha === "Izquierda"){
          	divLeft.innerHTML = divRight.innerHTML = "<b>Atrás</b>";
          	direccion(5);
          }


 }, true);


var direction = 0;

var direccion = function(dir){
	if(direction === 0){
		direction = dir;
	}else if(direction !== dir){
		switch(dir){
			case 1:
				websocket.emit('Izquierda');
				direction = dir;
			break;
			case 2:
				websocket.emit('Derecha');
				direction = dir;
			break;
			case 3:
				websocket.emit('Adelante');
				direction = dir;
			break;
			case 4:
				websocket.emit('Detener');
				direction = dir;
			break;
			case 5:
				websocket.emit('Atras');
				direction = dir;
			break;
		}
	}
}