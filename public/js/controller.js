/*
  Script para el control manual del vehículo robótico 
*/
var app = angular.module('myApp', ['btford.socket-io']).
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    }).
    controller('ArduController', function ($scope,mySocket) {
    //Variable Touched para determinar si se presiona sobre algún botón  
      $scope.touched = false;

    // Funciones para determinar cuándo se presiona o se deja de presionar algún botón
      $scope.touchStart = function() {
        $scope.touched = true;
      }

      $scope.touchEnd = function() {
        $scope.touched = false;
      }

      // Funciones que determinan que botón fue pulsado y así se ejecutar entonces la acción
        $scope.Adelante = function(){
           console.log('Adelante');
           Vibrar();
           mySocket.emit('Adelante');
        }

        $scope.Atras = function(){
           console.log('Atras');
           Vibrar();
           mySocket.emit('Atras');
        }

        $scope.Izquierda = function(){
           console.log('Izquierda');
           Vibrar();
           mySocket.emit('Izquierda');
        }

        $scope.Derecha = function(){
           console.log('Derecha');
           Vibrar();
           mySocket.emit('Derecha');
        }

        $scope.SinMovimiento = function(){
           console.log('SinMovimiento');
           StopVibrar();
           mySocket.emit('Detener');
        }



}).directive('myTouchstart', [function() {
                return function(scope, element, attr) {

                    element.on('touchstart', function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchstart); 
                        });
                    });
                };
            }]).directive('myTouchend', [function() {
                return function(scope, element, attr) {

                    element.on('touchend', function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchend); 
                        });
                    });
                };
            }]).controller('indexController', function ($scope,mySocket) {

            }).controller('AutController', function ($rootScope,$scope,$interval,mySocket) {
              $scope.data = {};
              $scope.boton = false;
              $scope.tiempo = 00;
              
              $scope.Iniciar = function(datos){
                if(datos.Distancia === undefined || datos.Tiempo === undefined){
                  alert("Debe Ingresar todos los datos y Los datos deben estar entre los rangos indicados Distancia <= 100  y Tiempo <= 90");
                }else{
                  console.log(datos);
                  $scope.boton = true;
                  mySocket.emit('Iniciar',datos);
                  $scope.tiempo = datos.Tiempo;
                  ini();
                }
              }

              $scope.Detener = function(){
                $scope.boton = false;
                mySocket.emit('Detener');
                stopini();
              }

             

            var stop;
            var ini = function() {
              if ( angular.isDefined(stop) ) return;
                stop = $interval(function() {
                if ($scope.tiempo > 0 ) {
                  $scope.tiempo = $scope.tiempo - 1;
                  console.log($scope.tiempo);
                } else {
                  stopini();
                }
              }, 1000);
            };

        var stopini = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };

})



