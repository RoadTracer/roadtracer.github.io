var myPos;
var GMap;

var positions = [{}];
var i = 0;

var buttonInd = 10;

var activeOption;

var options = [
  { type: "Irelevant", color: "#FFFFFF" },
  { type: "Drum de tara", color: "#00FF00" },
  { type: "Drum de oras", color: "#0000FF" },
]

function setup() {
  noCanvas();
  initNavigator();
  initButtons();
  activeOption = document.getElementById("Irelevant")
  initGPS();
}

function draw() {
}

function initNavigator() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(initMap);
}
function initMap(position) {
  GMap = new google.maps.Map(document.getElementById("map"),
    {
      zoom: 15,
      center: { lat: position.coords.latitude, lng: position.coords.longitude },
      mapTypeId: "terrain",
    });
}

function initButtons() {
  options.forEach(option => {
    print(option);
    var btn = document.createElement("BUTTON");
    btn.innerHTML = option.type;

    //btn.style.position = "absolute";
    //btn.style.top = buttonInd + "%";
    //buttonInd += 3;
    //btn.style.left = "10%";
    btn.style.backgroundColor = option.color;
    btn.style.border = "0px";

    btn.setAttribute('id', option.type);
    btn.setAttribute('onClick', 'ButtonPressed(id)');

    document.body.appendChild(btn);
    //print(btn); 
  });
}

function ButtonPressed(id) {
  activeOption = document.getElementById(id);
  positions = [{}];
  i = 0;
}

function initGPS() {
  if (navigator.geolocation)
    navigator.geolocation.watchPosition(updateMap);
}


function updateMap(position) {

  positions[i] = { lat: position.coords.latitude, lng: position.coords.longitude };

  i++;
  if (activeOption.id != "Irelevant") {
    var Path = new google.maps.Polyline({
      path: positions,
      geodesic: true,
      strokeColor: activeOption.style.backgroundColor,
      strokeOpacity: .5,
      editable: true,
      strokeWeight: 8,
    });
    Path.setMap(GMap);
    print(Path);
  }
}