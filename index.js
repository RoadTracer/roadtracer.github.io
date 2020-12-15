


const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
const icons = {
  Tip1: {
    name: "TTip1",
    icon: iconBase + "parking_lot_maps.png",
    color: "#FF0000",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  Tip2: {
    name: "TTip2",
    icon: iconBase + "library_maps.png",
    color: "#FF00FF",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
  Tip3: {
    name: "TTip3",
    icon: iconBase + "info-i_maps.png",
    color: "#00FF00",
    path: [{ lat: 0, lng: 0 }],
    polyline: "",
  },
};



let map, infoWindow;
let pos;


let myPosMarker;

let activeRoadType;

var lastPos;

function initMap(pos) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: pos.lat, lng: pos.lng },
    zoom: 16,
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

  if (pos != undefined && lastPos != undefined)
    if (lastPos.lat != pos.lat) {
      lastPos = pos;

      if (pos != undefined)
        myPosMarker.setPosition(pos);
      if (activeRoadType) {
        for (const key in icons) {
          const type = icons[key];
          if (type == activeRoadType) {
            //print(type.polyline.getPath());
            var myLatlng = new google.maps.LatLng(pos.lat, pos.lng);
            type.polyline.getPath().push(myLatlng);
            print(type.polyline.getPath());
          }
        }
      }
    }

}

function createPolylines() {
  for (const key in icons) {
    const type = icons[key];
    //print(type);
    type.polyline = new google.maps.Polyline({
      //path: type.path,
      strokeColor: type.color,
      strokeOpacity: 0.5,
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