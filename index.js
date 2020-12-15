


const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
const icons = {
  Tip1: {
    name: "TTip1",
    icon: iconBase + "parking_lot_maps.png",
    color: "#FF0000",
  },
  Tip2: {
    name: "TTip2",
    icon: iconBase + "library_maps.png",
    color: "#FF00FF",
  },
  Tip3: {
    name: "TTip3",
    icon: iconBase + "info-i_maps.png",
    color: "#00FF00",
  },
};



let map, infoWindow;
let pos;


let myPosMarker;

var activeRoadType;

function initMap(pos) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: pos.lat, lng: pos.lng },
    zoom: 15,
  });
  createPanToLocationButton();
  createPositionMarker();

  drawLegend();
  createRoadTypesButtons();

  createPolylines();
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
        if (firstTime == true)
          initMap(pos);
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
  //TODO: optimeze, change pos only when necessary
  myPosMarker.setPosition(pos);

  for (const ind in polylines) {
    //print(polylines[ind].name);
    poly = polylines[ind];
    if (activeRoadType != undefined)
      if (poly.name == activeRoadType.name) {
        const path = poly.getPath();
        path.push(pos);
        print(polylines);
        break;
      }
  }
}


let polylines = [];

function createPolylines() {

  for (const key in icons) {
    const type = icons[key];

    var poly = new google.maps.Polyline({
      name: type.name,
      icon: type.icon,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    poly.setMap(map);
    polylines.push(poly);
  }
  print(polylines);
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
  const legend = document.getElementById("legend");

  for (const key in icons) {
    const type = icons[key];
    const name = type.name;
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
    print("the same")
    activeRoadType = null;
  } else {
    print("not the same");
    activeRoadType = type;
    //print(activeRoadType);
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