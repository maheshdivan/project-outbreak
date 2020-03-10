// Creating map object
var map = L.map("map", {
  center: [0, 0],
  zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// Path to countries geoJSON
var geoJSON = "data/countries.geojson";

// Create array for ebola data
ebola_array = [];

// // Function for color
function getColor(d) {
  return d > 2000000 ? '#800026' :
    d > 1000000 ? '#BD0026' :
      d > 50000 ? '#E31A1C' :
        d > 2000 ? '#FC4E2A' :
          d > 1000 ? '#FD8D3C' :
            d > 500 ? '#FEB24C' :
              d > 250 ? '#FED976' :
                '#FFEDA0';

};


// Read in Ebola CSV
d3.csv("/data_sets/epidemic/ebola.csv", function (ebolaData) {
  // Cast all numeric columns
  ebolaData.forEach(function (data) {
    data.suspected_cases = +data.suspected_cases;
    data.probable_cases = +data.probable_cases;
    data.confirmed_cases = +data.confirmed_cases
    data.confirmed_probable_suspected_cases = +data.confirmed_probable_suspected_cases;
    data.suspected_deaths = +data.suspected_deaths;
    data.probable_deaths = +data.probable_deaths;
    data.confirmed_deaths = +data.confirmed_deaths;
    data.confirmed_probable_suspected_deaths = +data.confirmed_probable_suspected_deaths;
  });

  console.log(ebolaData);


  // Roll up ebola data by COuntry
  var countryRollUp = d3.nest()
    .key(function (d) { return d.Country })
    .rollup(function (v) {
      return {
        confirmed_cases: d3.sum(v, function (d) { return d.confirmed_cases }),
        confirmed_deaths: d3.sum(v, function (d) { return d.confirmed_deaths })
      }
    })
    .entries(ebolaData);

  var country = countryRollUp.map(Countries => Countries.key);
  var conf_cases = countryRollUp.map(Countries => Countries.value["confirmed_cases"]);
  var conf_deaths = countryRollUp.map(Countries => Countries.value["confirmed_deaths"]);
  ebola_array.push(country, conf_cases, conf_deaths);
  console.log(ebola_array);
});


// Grabbing our GeoJSON data..
d3.json(geoJSON, function (data) {

  // Add filter function
  function filterForISO(feature) {
    for (var i = 0; i < ebola_array[0].length; i++) {
      if (ebola_array[0][i] == feature.properties["ADMIN"]) return true;
    }
  };
  L.geoJson(data, {
    filter: filterForISO,

    style: function (feature) {
      return {
        color: "white",
        fillColor: getColor(feature.properties.confirmed_cases),
        // fillColor: "blue",
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {

      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },

        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function (event) {
          map.fitBounds(event.target.getBounds());
        }
      });

      for (var i = 0; i < ebola_array[0].length; i++) {
        if (ebola_array[0][i] == feature.properties.ADMIN) {
          layer.bindPopup("<h2>" + feature.properties.ADMIN + "</h2> <hr> <h3>" + "Confirmed Cases: " + ebola_array[1][i] + "</h3>  <h3>" + "Confirmed Deaths: " + ebola_array[2][i] + "</h3>");
        };
      };

    }

  }).addTo(map);
});

// Grabbing our GeoJSON data..

var test_array = [];

d3.json(geoJSON, function (data) {

  L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling

      for (var i = 0; i < ebola_array[0].length; i++) {
        if (ebola_array[0][i] == feature.properties.ADMIN) {
          feature.properties.confirmed_cases = ebola_array[1][i];
          test_array.push(feature.properties.ADMIN, feature.geometry,feature.properties.confirmed_cases)
          
        };
      };
    }

  });
  // console.log(data);
  // console.log(feature.properties.confirmed_cases);
});

console.log(test_array);


