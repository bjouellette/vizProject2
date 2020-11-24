// // API key
// const API_KEY = "YOUR API KEY HERE!";
const API_KEY = "pk.eyJ1IjoiY2hleWVubmVwYXJyb3R0IiwiYSI6ImNraGJhZnp6czBkbG0ycnNhMWozcGpsYWMifQ.lL6x_cnw_ya4MtHSvTJ_gA";
//   var myMap = L.map("map", mapProperties)
var myMap = L.map("map", {
  center: [21.8918, 4.1689],
  zoom: 3
  //layers: [satelliteMap, lightmap, outdoors]
}); //outdoors.addTo(myMap)
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 15,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY});
  var lightmap =L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  mapZoom: 15,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY});
  // Create a baseMaps object to hold the lightmap layer
   var baseMaps = {
    "Outdoors": outdoors, 
     "Satellite": satelliteMap,
     "Light Map": lightmap
  };
outdoors.addTo(myMap);
  var earthquakeData = new L.LayerGroup();
   // Create an overlayMaps object to hold the earthquake layer
   var overlayMaps = {
    "Happiness Score by Country": earthquakeData
  };
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
      }).addTo(myMap);
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(mapProperties);
  
  // Load in geojson data
var HappinessURL = "https://raw.githubusercontent.com/cheyenneparrott/leaflet-challenge/main/2015%20-%202019%20Happiness%20Report%20Data.geojson";

  d3.json(HappinessURL, function(data) {
      function earthCirclesize(magnitude){
          if (magnitude === 2.6)
          return 1;
          else
          return(magnitude * 3);
      }
      function earthCirclecolor(depth){
        if (depth > 140) return "red";
        else if (depth > 120) return "orange";
        else if (depth > 100) return "lightorange";
        else if (depth > 50) return "yellow";
        else if (depth > 20) return "lightgreen";
        else return "green";
    }
    function circleMaking(feature) {
      return {
        radius: earthCirclesize(feature.properties.HappinessScore),
        fillColor: earthCirclecolor(feature.properties.HappinessRank),
        weight: 0.5,
        color: "purple"
      }
    }
    // Create a Geojson layer containing a features array of the earthquake data
    L.geoJson(data, {
      pointToLayer: function(feature, latLong){
        return L.circleMarker(latLong);
      },
      style: circleMaking,
      onEachFeature: function (feature, layer){
        layer.bindPopup("Year: " + feature.properties.Year + "<br> Happiness Score: " + feature.properties.HappinessScore + "<br> Location: " + feature.properties.Country + "<br> Happiness Rank: " + feature.properties.HappinessRank)
      }
    }).addTo(earthquakeData);
  earthquakeData.addTo(myMap);
  // Creating legend
});



// Set up the legend
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");
//   var limits = geojson.options.limits;
//   var colors = geojson.options.colors;
//   var labels = [];

// //     // Add min & max
//   var legendInfo = "<h1>Happiness Score</h1>" +
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

// // Adding legend to the map
// legend.addTo(myMap);



