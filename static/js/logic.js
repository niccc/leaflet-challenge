var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";


function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [39, -98],
      zoom: 3,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
// function to associate color with magnitude
function magColor(mag)
{
    if (mag< 1) { return "#DAF7A6";}
    else if (mag< 2) { return "#FFC300"; }
    else if (mag< 3) { return "#FF5733"; }
    else if (mag< 4) { return "#C70039"; }
    else if (mag< 5) { return "#900C3F"; }
    else { return "#581845" ;} 

}

  function createMarkers(response) {
  
    // Pull the earthquake data
    var earthquakeData = response.features;
  
    // Initialize an array to hold earthquake markers
    var quakeMarkers = [];
  
    // Loop through the data
    for (var index = 0; index < earthQuake.length; index++) {
      var quake = earthquakeData[index];
      var lon= quake.geometry.coordinates[0];
      var lat = quake.geometry.coordinates[1];
      var mag = quake.properties.mag;
  
      // For each earthquake, create a marker and bind a popup with the earthquakes magnitude
      var quakeMarker = L.marker([lat, lon],
        {
            radius: mag*2,
            color: magColor(mag),
            fill: true,
            weight: 1,
            fillcolor: magColor(mag),
            fillOpacity: .8
            
        })
        
        .bindPopup("<h3>Magnitude:" + mag + "</h3>");
  
      // Add the marker to the earthquake markers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
  
  
  // Perform an API call to retrieve earthquake information. Call createMarkers when complete
  d3.json(url, createMarkers);
  