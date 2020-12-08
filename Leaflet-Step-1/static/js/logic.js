 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
// then, send the layer to the createMap() function.
var earthquakes = L.geoJSON(data.features, {
  onEachFeature : addPopup
});

createMap(earthquakes);
});


// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
// Give each feature a popup describing the place and time of the earthquake
return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Earthquakes": earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}
