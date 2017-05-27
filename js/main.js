function initMap(){
  var laboratoriaLima = {lat: -12.1191427, lng: -77.0349046};
  var map = new google.maps.Map(document.getElementById("map"),{
    zoom: 18,
    center: laboratoriaLima
  });

  var markadorLaboratoria = new google.maps.Marker({
    position : laboratoriaLima,
    map: map
  });

  var partida = document.getElementById("punto-partida");
  var destino = document.getElementById("punto-destino");

  new google.maps.places.Autocomplete(partida);
  new google.maps.places.Autocomplete(destino);

  var service = new google.maps.DirectionsService;
  var render = new google.maps.DirectionsRenderer;

  var calcularRuta = function (service, render) {
    service.route({
      origin: partida.value,
      destination: destino.value,
      travelMode: "DRIVING"
    }, function (response,status) {
      if(status === "OK"){
        var distancia = Number((response.routes[0].legs[0].distance.text.replace("km","")).replace(',',"."));

        tarifa.classList.remove("none");

        var costo = distancia*1.75;
        if(costo<4){
          tarifa.innerHTML="S/. 4";
        } else {
          tarifa.innerHTML="S/. "+ parseInt(costo);
        }

        render.setDirections(response);
      }  else{
        window.alert("No encontramos una ruta.");
      }
    });
  }

  render.setMap(map);
  var trazarRuta = function (){
    calcularRuta(service,render);
  };
  document.getElementById("trazar-ruta").addEventListener("click", trazarRuta);

  function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }

  var latitud,longitud;
  var funcionExito = function(posicion){
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;
    map.setZoom(18);
    map.setCenter({lat: latitud, lng: longitud});

    var miUbicacion = new google.maps.Marker({
      position: {lat: latitud, lng: longitud},
      map:map
    });
  }

  var funcionError = function (error) {
    alert("Tenemos un problema con tu ubicación");
  }

  document.getElementById("buscar").addEventListener("click",buscar);

}
