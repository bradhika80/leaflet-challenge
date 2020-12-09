// Store our API endpoint inside queryUrl
queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


  // reference :- https://leafletjs.com/examples/geojson/

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  // create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.  
  var earthquakes = L.geoJSON(data.features, {
    // make the markers circle
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng);
        } ,     
      // style the markers
      style: geojsonMarkerOptions,
      // add the popup feature for the points
    onEachFeature : addPopup
  });

  // create the map for earthquakes
  createMap(earthquakes);
});

var tectonicLayer = new L.LayerGroup();
// get the tectonic plates data

  d3.json("static/data/PB2002_boundaries.json", function(plateData) {
    // Create a GeoJSON Layer the plateData
    L.geoJson(plateData, {
        color: "#DC143C",
        weight: 2
    // Add plate data to tetonics Layer
    }).addTo(tectonicLayer);
    // Add the layer to the Map
    tectonicLayer.addTo(myMap);
  });


// set the marker options 
function geojsonMarkerOptions(feature) {
    
  return {
   // radius of circle = magnitude, color = depth
    radius: feature.properties.mag * 2,
    fillColor:GetColor(feature.geometry.coordinates[2]),
    color: "#000000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Function that will determine the color of a earthquake based on the depth of earthquake
function GetColor(depth) {
 
  switch (true) {
  case depth >= 90:
    return "#FF3300"
    break;
  case depth >= 70 && depth < 90:
    return "#FBAB91";
    break;
  case depth >= 50 && depth < 70:
    return " #FFE20B";
    break;
  case depth >= 30 && depth < 50:
    return " #F4FF00";
    break;
  case depth >= 10 && depth < 30:
    return "#C0FF02";
    break;
  case depth >= -10 && depth < 10:
      return "#32CC32";
      break;
  default:
    return "white";
    break;
  }
}

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

  // Define outdoorMap and darkmap layers
  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // add the satellite layer
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });



  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoorMap,
    "Grayscale": grayscaleMap,
    "Satiellite": satelliteMap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Tectonic Plates" : tectonicLayer,
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the outdoorMap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [outdoorMap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Set up the legend
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depths = [(-10), 10, 30, 50, 70, 90],
        labels = [];


    div.innerHTML += "<h3>Depth</h3>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<p><i style="background:' + GetColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br/>' : '+') +'</p>';
    }

    return div;
};

 // Adding legend to the map
 legend.addTo(myMap);



}


