// Set Epidemic parameters for API
var epidemic = "ebola"
queryurl = `http://0.0.0.0:5000/api/v1.0/epidemic/` + epidemic
console.log(queryurl)
var epidemic_data = [];
var countryRollUp_data = [];
var between_array = [];



// Creating map object
var map = L.map("map", {
  container: "map-id",
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

function founInArray(array, data) {
  for (var i = 0; i < array.length; i++) {
    if (array[i]["country"] == data) {
      console.log("yay");
      getColor(array[i]["confirmed"])
    }
  };
};


// Start the nested json reading with getting epidemic data
d3.json(queryurl, function (data) {
  for (var i = 0; i < data.length; i++) {
    epidemic_data.push({
      date: data[i][0],
      country: data[i][1],
      confirmed: data[i][2],
      deaths: data[i][3]
    });
  };
  console.log(epidemic_data);

  var countryRollUp = d3.nest()
    .key(function (d) { return d.country })
    .rollup(function (v) {
      return {
        confirmed: d3.sum(v, function (d) { return d.confirmed }),
        deaths: d3.sum(v, function (d) { return d.deaths })
      }
    })
    .entries(epidemic_data);
  console.log(countryRollUp)

  // Changing contruRollUp to and array
  var country = countryRollUp.map(Countries => Countries.key);
  var conf_cases = countryRollUp.map(Countries => Countries.value["confirmed"]);
  var conf_deaths = countryRollUp.map(Countries => Countries.value["deaths"]);
  between_array.push(country, conf_cases, conf_deaths);

  for (var i = 0; i < between_array[0].length; i++) {
    countryRollUp_data.push({
      country: between_array[0][i],
      confirmed: between_array[1][i],
      deaths: between_array[2][i]
    });
  };

  console.log(between_array)
  console.log(countryRollUp_data);
  console.log(countryRollUp_data["confirmed"]);
});

// Get geoJSON sata
d3.json(geoJSON, function (data) {
  // Add filter function, to only plot the countries we need
  function filterForISO(feature) {
    for (var i = 0; i < epidemic_data.length; i++) {
      if (epidemic_data[i]["country"] == feature.properties["ADMIN"]) return true;
    }
  };

  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {

    // Called on each feature
    onEachFeature: function (feature, layer) {
      founInArray(countryRollUp_data, feature.properties.ADMIN)
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

      for (var i = 0; i < countryRollUp_data.length; i++) {
        if (countryRollUp_data[i]["country"] == feature.properties.ADMIN) {
          layer.bindPopup("<h2>" + feature.properties.ADMIN + "</h2> <hr> <h3>" + "Confirmed Cases: " + countryRollUp_data[i]["confirmed"] + "</h3>  <h3>" + "Confirmed Deaths: " + countryRollUp_data[i]["deaths"] + "</h3>");
          feature.properties.confirmed = countryRollUp_data[i]["confirmed"]
          console.log(feature.properties.confirmed)
        };
      };
      return data;

    },

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


  }).addTo(map);
});

