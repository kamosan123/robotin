// server.js
var cons = require("consolidate");
var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
//var Raspi = require("raspi-io");
httpServer.listen(3000);
var io = require('socket.io').listen(httpServer);

io.set('log level', 1);
app.engine("html", cons.swig); //Template engine...
app.set("view engine", "html");
app.set("views", __dirname + "/vistas");
app.use(express.static('public'));


// ============ Rutas de la interfaz de Usuario ====================
app.get('/', function(req, res, next) {
    res.render('index'); // Muestra el menu
});

app.get('/manual', function(req, res, next) {
    res.render('ControlManual'); // Muestra el Control Manual
});

app.get('/video', function(req, res, next) {
    res.render('Video'); // Utiliza la camara de un celular para enviar video
});


app.get('/vr', function(req, res, next) {
    res.render('ControlVr'); // Crea dos imagenes paralelas del mismo tamaño, ideal para las Carboard
});

//Ruta sí, no se encuentra lo que el usuario busca
app.get("*", function(req, res) {
    res.status(404).send("Página no encontrada :( en el momento");
});


console.log('Servidor disponible en http://localhost:' + 3000);

//Configuracion del Hardware a utilizar, para nuestro Caso:  Arduino Mega
//var board = new five.Board({
//io: new Raspi()
//});

// Inicializacion del sistema con los pines a utilizar
//board.on("ready", function() {
//  motorA1 = new five.Led(9);
//  motorA2 = new five.Led(8);
//  motorB1 = new five.Led(5);
//  motorB2 = new five.Led(4);
//  on = new five.Led(13); //Led de encendido titila al estar listo para recibir señal
//  on.blink();
//});

//==================== Sistema de Control en tiempo real Socket.io ==============================
io.on('connection', function(socket) {


    /*
      Funciones para encender y apagar las señales enviadas a cada motor siempre dos pues cada motor
      puede ir hacia Adelante o hacia atrás por ello las variables A1 y A2 corresponden un motor derecho
      y B1 y B2 corresponden al Izquierdo, para usarlos se envía energía a alguno de los dos pines A1 y no
      se envia nada a A2 con ello el motor avanza y al contrario retrocede.

      La función Adelante enciende el motor A en sentido contrario al motor B
    */

    socket.on('Adelante', function(data) {
        motorA2.on();
        motorB1.on();
        console.log('ir hacia Adelante');
    });
    // La función Atrás enciende el motor B en sentido contrario al motor A
    socket.on('Atras', function(data) {
        motorA1.on();
        motorB2.on();
        console.log('ir hacia Atras');
    });

    // la función Izquierda  y Derecha enciende ambos motores en un mismo sentido
    socket.on('Izquierda', function(data) {
        motorB1.on();
        motorA1.on();
        console.log('ir hacia la Izquierda');
    });

    socket.on('Derecha', function(data) {
        motorA2.on();
        motorB2.on();
        console.log('ir hacia la Derecha');
    });
    // la funcion Detener deja de envíar señales a los motores
    socket.on('Detener', function(data) {
        motorA1.off();
        motorA2.off();
        motorB1.off();
        motorB2.off();
        console.log('Detener');
    });
    // Función newFrame recibe y emite imágenes que conforman el video que es mostrado al usuario
    socket.on('newFrame', function(obj) {
        socket.broadcast.emit('setFrame', obj)
    });

});


console.log('Waiting for connection');
