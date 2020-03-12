// Set Epidemic parameters for API
var epidemic = "ebola"
queryurl = `http://0.0.0.0:5000/api/v1.0/epidemic/` + epidemic
console.log(queryurl)

// Path to countries geoJSON
var geoJSON = "data_sets/countries.geojson";

// Creating map object
map = L.map("map-id", {
  center: [15, -10],
  zoom: 1.5
});

// API key, dont know why i couldnt call it from the config.js file
var API_KEY = "pk.eyJ1IjoiYXJhY2VseTExOTQiLCJhIjoiY2s3MmsyMTFqMDM2OTNrdXU5anh6bmJpYyJ9.NZWat1zkj9hmfgxVxC2Cbw";

// Adding tile layer to map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);


// Create dummy geoJSON layer so we can refresh data on click
d3.json(geoJSON).then(function (data) {
  // Creating a geoJSON layer with the retrieved data
  geojsonLayer = L.geoJson(data, {
  });
  geojsonLayer.addTo(map);
});



// Create function to retrive data from epidemic API and geoJSON
function addMapLayers(startDate, endDate) {

  // Create empty arrays that will be used
  var epidemic_data = [];
  var countryRollUp_data = [];
  var between_array = [];

  // Get epidemic data from API
  d3.json(queryurl).then(function (data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][2] == 0 && data[i][3] == 0) {

      }
      else {
        epidemic_data.push({
          date: data[i][0],
          country: data[i][1],
          confirmed: data[i][2],
          deaths: data[i][3]
        });
      };
    };
    console.log(epidemic_data);
    console.log(endDate);

    // Filter epidemic data by Date
    var filteredByDate = epidemic_data.filter(function (data) {
      var date = new Date(data.date);
      // console.log(date)
      return (date >= startDate && date <= endDate);
    });
    console.log(filteredByDate)

    // Roll up date filtered data by country
    var countryRollUp = d3.nest()
      .key(function (d) { return d.country })
      .rollup(function (v) {
        return {
          confirmed: d3.sum(v, function (d) { return d.confirmed }),
          deaths: d3.sum(v, function (d) { return d.deaths })
        }
      })
      .entries(filteredByDate);

    // Transfer rolled up data to an inbetween array that will then turn into a json for easier use
    var country = countryRollUp.map(Countries => Countries.key);
    var conf_cases = countryRollUp.map(Countries => Countries.value["confirmed"]);
    var conf_deaths = countryRollUp.map(Countries => Countries.value["deaths"]);
    between_array.push(country, conf_cases, conf_deaths);

    // Push all filtered and rolled up data into JSON for easier use
    for (var i = 0; i < between_array[0].length; i++) {
      countryRollUp_data.push({
        country: between_array[0][i],
        confirmed: between_array[1][i],
        deaths: between_array[2][i]
      });
    };
    console.log(countryRollUp_data);


    // Get geoJSON data
    d3.json(geoJSON).then(function (data) {
      // Add filter function, to only plot the countries we need
      function filterForISO(feature) {
        for (var i = 0; i < countryRollUp_data.length; i++) {
          if (countryRollUp_data[i]["country"] == feature.properties["ADMIN"]) return true;
        }
      };

      // Creating a geoJSON layer with the retrieved data
      geojsonLayer = L.geoJson(data, {

        // Implement filter for only countries we need
        filter: filterForISO,

        style: function (feature) {
          return {
            color: "white",
            // fillColor: getColor(feature.properties.confirmed),
            fillColor: "blue",
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

          // Add popup information 
          for (var i = 0; i < countryRollUp_data.length; i++) {
            if (countryRollUp_data[i]["country"] == feature.properties.ADMIN) {
              layer.bindPopup("<text> <b>" + feature.properties.ADMIN + "</b> </text> <br> <text>" + "Confirmed Cases: " + countryRollUp_data[i]["confirmed"] + "</text> <br> <text>" + "Confirmed Deaths: " + countryRollUp_data[i]["deaths"] + "</text>");
              feature.properties.confirmed = countryRollUp_data[i]["confirmed"]
              // console.log(feature.properties.confirmed)
            };
          };
        },

      });
      geojsonLayer.addTo(map);
    });
  });
};


// Getting a reference to the submit button
var submit = d3.select("#submit-btn");

// Retrieving date when button is clicked
submit.on("click", function () {
  // Remove already plotted layer
  map.removeLayer(geojsonLayer);

  // Recenter map
  map.setView([15, -10], 1.5)

  // Retrive new dates 
  startDate = new Date(document.getElementById("date-1").value);
  endDate = new Date(document.getElementById("date-2").value);
  console.log("Start Date: " + startDate);
  console.log("End Date: " + endDate);

  // Plot new info
  addMapLayers(startDate, endDate);
});

