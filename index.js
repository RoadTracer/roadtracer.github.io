/*
drum cu pamant - verde
drum pietruit - rosu
asflat - gri
drumuri din placi, umpluturi, etc - galben

puncte: 
*/

window.onbeforeunload = function () { return "You will lose all your progress!"; }

const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
const icons = {
  roadType1: {
    name: "Drum de pamant",
    icon: "./Icons/Green.png", //iconBase + "parking_lot_maps.png",
    color: "#00FF00",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType2: {
    name: "Drum pietruit",
    icon: "./Icons/Red.png", //iconBase + "library_maps.png",
    color: "#FF0000",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType3: {
    name: "Drum cu asfalt",
    icon: "./Icons/Gray.png", //iconBase + "info-i_maps.png",
    color: "#696969",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType4: {
    name: "Drum din placi, umpluturi etc.",
    icon: "./Icons/Yellow.png", //iconBase + "info-i_maps.png",
    color: "#FFFF00",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },

  // Route_show: {
  //   name: "Arata traseu",
  // },
  // Route_clear: {
  //   name: "Ascunde traseu",
  // },
  Route_init: {
    name: "Planifica traseu",
    icon: "./Icons/Blue2.png", //iconBase + "info-i_maps.png",
  },
};

let routePolyline;

let map, infoWindow;
let pos;
let lastPos;
let myLatlng;

let myPosMarker;

let activeRoadType;
let PointsIndex = 0;

let legend;
let ActiveRoadTypeText;

function initMap(pos) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: pos.lat, lng: pos.lng },
    zoom: 16,
    gestureHandling: "cooperative",
    rotateControl: true,
    streetViewControl: false,
    zoomControl: false,
    mapTypeId: 'hybrid',
    clickableIcons: false,
    //rotateControl: true,
    //rotateControlOptions: true,
  });
  map.setTilt(0);
  createPositionMarker();
  createPanToLocationButton();

  drawLegend();
  createRoadTypesButtons();

  createPolylines();
  initOwnPolyline();

  initPointField();
  initActiveRoadTypeText();

  createSnapToMapButton();
  createHideEveryButton();
  ActiveRoadTypeText.innerHTML = "Comanda activa: ";
}

function createSnapToMapButton() {
  const SnapButton = document.createElement("button");
  SnapButton.textContent = "Snap to road";
  SnapButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(SnapButton);
  SnapButton.addEventListener("click", () => snapLocationToRoad())
}

function createHideEveryButton() {
  const HideButton = document.createElement("button");
  HideButton.textContent = "Arata/Ascunde comenzi";
  HideButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(HideButton);
  HideButton.addEventListener("click", () => HideButtons())
}

function HideButtons() {

  //print(map.controls[google.maps.ControlPosition.LEFT_BOTTOM]);
  var Buttons = map.controls[google.maps.ControlPosition.LEFT_BOTTOM];
  for (var i = 0; i < Buttons.length; i++) {
    //print(Buttons.getAt(i));
    if (Buttons.getAt(i).style.display == "none")
      Buttons.getAt(i).style.display = "block"
    else
      Buttons.getAt(i).style.display = "none"
  }
}

function initActiveRoadTypeText() {

  ActiveRoadTypeText = document.createElement("h1");
  ActiveRoadTypeText.style.color = "white";
  ActiveRoadTypeText.style.background = "black"
  //ActiveRoadTypeText.style.outlineColor = "black";
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(ActiveRoadTypeText);
}

function initPointField() {
  const inputField = document.createElement("input");
  inputField.placeholder = "Descriere punct foraj";
  inputField.classList.add("custom-map-control-button");

  inputField.addEventListener('change', newPointAddedEvent);
  inputField.addEventListener('focus', clearField);
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(inputField);
}

function clearField(){
  this.value = "";
}

function newPointAddedEvent(text) {

  const inText = text.target.value;
  if (!inText || !inText.trim())
    return;

    var r = /\d+/;
    PointsIndex = inText.match(r);
   
    if(inText.match(r) == null){
      alert("Nu a fost gasit numarul forajului")
      return;
    }

    //Add a marker
  new google.maps.Marker({
    position: new google.maps.LatLng(pos.lat, pos.lng),
    map: map,
    label: "F" + PointsIndex,
    draggable: true,
  });

  //Update Legend
  const div = document.createElement('div');
  const img = document.createElement('img');
  const p = document.createElement('p');

  img.src = "./Icons/Marker.png"
  img.style.float = "left";
  img.style.clear = "both";

  //const textNode = document.createTextNode("F" + PointsIndex + ": " + inText);
  const textNode = document.createTextNode(inText);
  p.appendChild(textNode);
  p.style.maxWidth = "60ch"
  p.style.float = "left";

  div.appendChild(img);
  div.appendChild(p);

  legend.appendChild(div);
}

function firstTryToUpdateLegend() {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const imgDiv = document.createElement("div");
  const pText = document.createElement("p");
  const pIndex = document.createElement("p");

  //imgDiv.id = "container"
  imgDiv.style.border = "none";
  imgDiv.style.height = "32px";
  imgDiv.style.width = "32px";
  imgDiv.style.position = "relative";

  img.src = "./Icons/Marker.png"
  img.style.float = "left";
  img.style.clear = "both";

  pIndex.style.position = "absolute";
  pIndex.style.top = "-6px" //"50%";
  pIndex.style.left = "8px" //"50%";
  const indexTxtNode = document.createTextNode("F" + PointsIndex);
  pIndex.appendChild(indexTxtNode);

  pText.style.maxWidth = "20ch";
  pText.style.float = "left";
  pText.style.position = "absolute";
  pText.style.left = "37px"
  const descriptionTxtNode = document.createTextNode(inText);
  pText.appendChild(descriptionTxtNode);

  imgDiv.appendChild(img);
  imgDiv.appendChild(pIndex);
  imgDiv.appendChild(pText);

  div.appendChild(imgDiv);
  //div.appendChild(pText);

  legend.appendChild(imgDiv);
}

function getLocation(firstTime) {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (firstTime == true) {
          initMap(pos);
          lastPos = pos;
        }
        else {
          if (pos != undefined && myPosMarker != undefined)
            myPosMarker.setPosition(pos);
        }
      }
    )
  }
}

function setup() {
  getLocation(true);
  //frameRate(1);
}


function draw() {

  getLocation(false);

  updateRouteVisibility();
  //updatePoints();

  if (pos != undefined)
    if (mapUpdateNeeded()) {
      if (activeRoadType != null) {
        if (activeRoadType != icons.Route_init &&
          activeRoadType != icons.Route_clear &&
          activeRoadType != icons.Route_show) {
          //snapLocationToRoad();
          updatePolylines();
          //lastPos = pos;
        }
      }
    }
}

function snapLocationToRoad() {

  if (activeRoadType == null)
    return;

  if (activeRoadType == icons.Route_init) {
    var path = routePolyline.getPath();
  } else {
    var path = activeRoadType.polyline.getPath();
  }

  //print(path.getAt(0).toUrlValue());

  var newPathValues = [];

  for (var i = 0; i < path.length; i++) {
    newPathValues.push(path.getAt(i).toUrlValue());
  }

  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: "AIzaSyBlgYKld9QIQT9AALcT-Y2p2tOcQy-hROg",
    path: newPathValues.join('|') //pos.lat + ", " + pos.lng
  }, function (data) {
    //print(data);
    processSnapResponse(data);
  })
}

function processSnapResponse(data) {

  snappedCoordinates = [];
  placeIdArray = [];

  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
      data.snappedPoints[i].location.latitude,
      data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
  }

  if (activeRoadType == icons.Route_init) {
    routePolyline.setMap(null);

    routePolyline = new google.maps.Polyline({
      strokeColor: '#0000FF',
      strokeOpacity: .7,
      strokeWeight: 13,
      editable: true,
      path: snappedCoordinates,
    });
    routePolyline.setMap(map);
  }
  else {
    activeRoadType.polyline.setMap(null);

    activeRoadType.polyline = new google.maps.Polyline({
      strokeColor: activeRoadType.color,
      strokeOpacity: .7,
      strokeWeight: 13,
      editable: true,
      path: snappedCoordinates,
    });
    activeRoadType.polyline.setMap(map);
  }
}

function mapUpdateNeeded() {
  const minDistanceForUpdate = 0.00025;

  return (pos.lat >= lastPos.lat + minDistanceForUpdate || pos.lat <= lastPos.lat - minDistanceForUpdate ||
    pos.lng >= lastPos.lng + minDistanceForUpdate || pos.lng <= lastPos.lng - minDistanceForUpdate)
}

function updatePolylines() {
  for (const key in icons) {
    const type = icons[key];


    if (type.icon == null || type.polyline == null || type == icons.Route_init)
      continue;

    if (type == activeRoadType) {
      myLatlng = new google.maps.LatLng(pos.lat, pos.lng);
      //print(pos.lat);
      type.polyline.getPath().push(myLatlng);
      //print(type.polyline.getPath());
    }
  }
  lastPos = pos;
}

function updateRouteVisibility() {
  if (activeRoadType == icons.Route_clear)
    if (routePolyline.map == map)
      routePolyline.setMap(null);
  if (activeRoadType == icons.Route_show)
    if (routePolyline.map == null)
      routePolyline.setMap(map);
}

function updatePoints() {
  for (const key in icons) {
    const type = icons[key];

    if (type.polyline != null || type.icon == null) continue;

    if (type == activeRoadType) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map,
        icon: type.icon,
      });

      activeRoadType = null;
    }

  }
}

function initOwnPolyline() {
  const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4,
  };
  
  routePolyline = new google.maps.Polyline({
    strokeColor: "#0000FF",
    strokeOpacity: .7,
    strokeWeight: 13,
    editable: true,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: "20px",
      },
    ], 
   });
  routePolyline.setMap(map);

  map.addListener("click", addLatLng);
}

function addLatLng(event) {
  //print(event.latLng.lat);
  if (activeRoadType == icons.Route_init) {
    const path = routePolyline.getPath();
    path.push(event.latLng);
  }
}

function createPolylines() {
  for (const key in icons) {
    const type = icons[key];

    if (type.icon == null || type.polyline == null)
      continue;

    type.polyline = new google.maps.Polyline({
      //path: type.path,
      strokeColor: type.color,
      strokeOpacity: 0.7,
      strokeWeight: 13,
      editable: true,
      geodesic: true,
    });
    type.polyline.setMap(map);
    type.path.pop();
  }
}


function createPositionMarker() {
  myPosMarker = new google.maps.Marker({
    position: new google.maps.LatLng(pos.lat, pos.lng),
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
    },
  });
}


function drawLegend() {
  legend = document.getElementById("legend");

  for (const key in icons) {
    if (icons[key].icon == null)
      continue;
    const type = icons[key];
    var name = type.name;
        if(type == icons.Route_init)
    name = "Traseu Analizat"
    const icon = type.icon;
    const div = document.createElement("div");
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}


function createRoadTypesButtons() {
  for (const key in icons) {
    const type = icons[key];
    const TypeButton = document.createElement("button");
    TypeButton.textContent = type.name;
    TypeButton.classList.add("custom-map-control-button");
    TypeButton.addEventListener("click", () => onTypeButtonPressed(type));

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(TypeButton);
  }
}
function onTypeButtonPressed(type) {
  if (activeRoadType == type) {
    updatePolylines();
    //snapLocationToRoad();
    activeRoadType = null;
    ActiveRoadTypeText.innerHTML = "Comanda activa: ";
    ActiveRoadTypeText.style.background = "white";
    ActiveRoadTypeText.style.color = "black";
    initOwnPolyline(); //NEW
    } else {
    activeRoadType = type;
    type.polyline = new google.maps.Polyline({
      strokeColor: type.color,
      strokeOpacity: 0.7,
      strokeWeight: 13,
      editable: true,
    });
    type.polyline.setMap(map);
    updatePolylines();
    ActiveRoadTypeText.innerHTML = "Comanda activa: " + activeRoadType.name;
    if (activeRoadType.color == null)
      ActiveRoadTypeText.style.background = "white";
    else
      ActiveRoadTypeText.style.background = activeRoadType.color;
    ActiveRoadTypeText.style.color = "black";

  }

}

function createPanToLocationButton() {
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => PanToLocation()
  );
}
function PanToLocation() {
  getLocation();
  map.setCenter(pos);
}