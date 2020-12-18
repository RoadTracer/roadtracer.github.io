/*
drum cu pamant - verde
drum pietruit - rosu
asflat - gri
drumuri din placi, umpluturi, etc - galben

puncte: 
*/


//window.onbeforeunload = function () {return "You will lose all your progress!";}

const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
const icons = {
  roadType1: {
    name: "Drum de pamant",
    icon: iconBase + "parking_lot_maps.png",
    color: "#00FF00",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType2: {
    name: "Drum pietruit",
    icon: iconBase + "library_maps.png",
    color: "#FF0000",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType3: {
    name: "Drum cu asfalt",
    icon: iconBase + "info-i_maps.png",
    color: "#696969",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  roadType4: {
    name: "Drum din placi, umpluturi etc",
    icon: iconBase + "info-i_maps.png",
    color: "#FFFF00",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },


  roadPoint_F: {
    name: "Punct foraj",
    icon: iconBase + "info-i_maps.png",
    color: "#00FFFF",
  },

  Route_show: {
    name: "Show route",
  },
  Route_clear: {
    name: "Hide route",
  },
  Route_init: {
    name: "Plan route",
  },
};

let routePolyline;

let map, infoWindow;
let pos;
let lastPos;
let myLatlng;

let myPosMarker;

let activeRoadType;


function initMap(pos) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: pos.lat, lng: pos.lng },
    zoom: 16,
    gestureHandling: "greedy",
  });
  createPanToLocationButton();
  createPositionMarker();

  drawLegend();
  createRoadTypesButtons();

  createPolylines();
  initOwnPolyline();
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
         else
         {
          myPosMarker.setPosition(pos);
        }
      }
    )
  }
}

function setup() {
  getLocation(true);
  frameRate(1);
}


function draw() {

  getLocation(false);

  snapLocationToRoad();

  updateRouteVisibility();
  updatePoints();

  if (pos != undefined)
  if ( mapUpdateNeeded() )
  {
    if (activeRoadType)
      if (activeRoadType != icons.Route_init && activeRoadType != icons.Route_clear)
        updatePolylines();
    lastPos = pos;
  }
}

function snapLocationToRoad(){

  if(pos == undefined)
    return null;

    $.get('https://roads.googleapis.com/v1/snapToRoads', {
      interpolate: true,
      key: "AIzaSyBlgYKld9QIQT9AALcT-Y2p2tOcQy-hROg",
      path: pos.lat + ", " + pos.lng
    }, function(data)
    {
      processSnapResponse(data);
    })
}

function processSnapResponse(data){
  snappedPosition = pos;

  for (var i = 0; i < data.snappedPoints.length; i++) {
       snappedPosition.lat = data.snappedPoints[i].location.latitude,
       snappedPosition.lng = data.snappedPoints[i].location.longitude;
  }

  if(snappedPosition != null && snappedPosition != undefined &&
     snappedPosition.lat != null && snappedPosition.lat != undefined && 
     snappedPosition.lng != null && snappedPosition.lng != undefined )

    pos = snappedPosition;
}

function mapUpdateNeeded()
{
  const minDistanceForUpdate = 0.00001;

  return ( pos.lat >= lastPos.lat + minDistanceForUpdate || pos.lat <= lastPos.lat - minDistanceForUpdate ||
           pos.lng >= lastPos.lng + minDistanceForUpdate || pos.lng <= lastPos.lng - minDistanceForUpdate)
}

function updatePolylines() {
  for (const key in icons) {
    const type = icons[key];

    if (type.icon == null || type.polyline == null)
      continue;

    if (type == activeRoadType) {
      myLatlng = new google.maps.LatLng(pos.lat, pos.lng);
      type.polyline.getPath().push(myLatlng);
      print(type.polyline.getPath());
    }
  }
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
      myLatlng = new google.maps.LatLng(pos.lat, pos.lng);

      const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: type.icon,
      });

      activeRoadType = null;
    }

  }
}

function initOwnPolyline() {
  routePolyline = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: .5,
    strokeWeight: 3,
    editable: true,
  });
  routePolyline.setMap(map);

  map.addListener("click", addLatLng);
}

function addLatLng(event) {
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
      strokeWeight: 10,
      editable: true,
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
  const legend = document.getElementById("legend");

  for (const key in icons) {
    if (icons[key].icon == null)
      continue;
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
    print("Cleared activeRoadType")
    activeRoadType = null;
  } else {
    print("activeRoadType updated");
    activeRoadType = type;
    type.polyline = new google.maps.Polyline({
      strokeColor: type.color,
      strokeOpacity: 0.7,
      strokeWeight: 10,
      editable: true,
    });
    type.polyline.setMap(map);
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

