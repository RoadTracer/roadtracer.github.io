// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.

// var demo = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     demo.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
// function showPosition(position) {
  //demo.innerHTML = "Latitude: " + position.coords.latitude + 
  //"<br>Longitude: " + position.coords.longitude;

  //print(position.coords.latitude + " " + position.coords.longitude);
//}

// function initMap() {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 3,
//     center: { lat: 0, lng: -180 },
//     mapTypeId: "terrain",
//   });
//   const flightPlanCoordinates = [
//     { lat: 37.772, lng: -122.214 },
//     { lat: 21.291, lng: -157.821 },
//     { lat: -18.142, lng: 178.431 },
//     { lat: -27.467, lng: 153.027 },
//   ];
//   const flightPlanCoordinates2 = [
//     { lat: 37.772, lng: -122.214 },
//     { lat: 21.291, lng: -157.821 },
//     { lat: -18.142, lng: 178.431 },
//     { lat: -27.467, lng: 153.027 },
//     { lat: 37.772, lng: -122.214 },

//   ];
//   const flightPath = new google.maps.Polyline({
//     path: flightPlanCoordinates,
//     geodesic: true,
//     strokeColor: "#FF0000",
//     strokeOpacity: 1.0,
//     editable: true,
//     strokeWeight: 2,
//   });

//   const flightPath2 = new google.maps.Polyline({
//     path: flightPlanCoordinates2,
//     geodesic: true,
//     strokeColor: "#FF00FF",
//     strokeOpacity: 0.5,
//     editable: true,
//     strokeWeight: 2,
//   });
//   //flightPath.setMap(map);

//   flightPath2.setMap(map);
//   setTimeout("getLocation()", 1000);
// }

//window.onbeforeunload = function () {return "Dude, are you sure you want to leave? Think of the kittens!";}
