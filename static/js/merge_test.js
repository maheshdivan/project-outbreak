// Function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
};

// Path to countries geoJSON
var geoJSON = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
console.log(geoJSON)

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
  console.log(geoJSON);
  // Creating a geoJSON layer with the retrieved data
  geojsonLayer = L.geoJson(data, {
  });
  geojsonLayer.addTo(map);
});


// Create function to retrive data from epidemic API and geoJSON
function addMapLayers(startDate, endDate, epidemic) {


  // Set Epidemic parameters for API
  queryurl = `http://0.0.0.0:5000/api/v1.0/epidemic/` + epidemic;
  console.log(queryurl)

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

    ///////////// Roll up country filtered data by country/////////////
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


    /////// Print out top 5 countries with confirmed cases data ///////
    // Sort data from highest to lowest confirmed cases
    var sorted_data = countryRollUp_data.sort(function (a, b) {
      return b.confirmed - a.confirmed;
    });

    // If statement to only get the top 5 countries, len = 4 since 0 is counted
    if (sorted_data.length > 5) {
      len = 5;
    } else {
      len = sorted_data.length;
    }

    //function that appeneds new row to the list
    function appenedToList(text) {
      var ul = document.getElementById("list");
      var li = document.createElement("li");
      
      li.appendChild(document.createTextNode(text[0]));
      br = document.createElement("br");
      li.appendChild(br);
      li.appendChild(document.createTextNode(text[1]));
      br = document.createElement("br");
      li.appendChild(br);
      li.appendChild(document.createTextNode(text[2]));

      ul.appendChild(li);
      
    };

    // Loop through sorted data and print info into list 

    for (var i = 0; i < len; i++) {
      var text = ["Country: " + sorted_data[i]['country'],
                  "Confirmed cases: " + formatNumber(sorted_data[i]['confirmed']),
                  "Confirmed deaths: " + formatNumber(sorted_data[i]['deaths'])];
      appenedToList(text)
    };


    ///////////// Roll up date filtered data by country/////////////
    var totalByDate = d3.nest()
      .key(function (d) { return d.date})
      .rollup(function (v) {
        return {
          total_case: d3.sum(v, function (d) { return d.confirmed }),
          total_death: d3.sum(v, function (d) { return d.deaths })
        }
      })
      .entries(filteredByDate);
    console.log("totalByDate", totalByDate);

    var titles = totalByDate.map(dates => dates.key);
    var conf_case = totalByDate.map(dates => dates.value["total_case"]);
    var conf_death = totalByDate.map(dates => dates.value["total_death"]);
    // console.log(conf_death)  
    
    if (conf_case == 0){
      window.alert("No Confirm cases, please check date range");
    }

    // Plot bar graph by date
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: epidemic + " Confirmed Cases",
      x: titles,
      y: conf_case,
      line: {
        color: "#00796B"
      }
    };

    var trace2 = {
      type: "scatter",
      mode: "lines",
      name: epidemic + " Confirmed Deaths",
      x: titles,
      y: conf_death,
      yaxis: "y2",
      line: {
        color: "#DC1A0E"
      }
    };

    var layout = {
      showlegend: true,
      legend: {
        x: 0,
        y: 1.5
      },
      yaxis: {
        autorange: true
      },
      yaxis2: {
      //  autorange: true,
        side: 'right',
        overlaying: 'y'

      },
      autosize: true
    };

    var data = [trace1, trace2];
    Plotly.newPlot("bar-id", data, layout);



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
              layer.bindPopup("<text> <b>" + feature.properties.ADMIN + "</b> </text> <br> <text>" + "Confirmed Cases: " + formatNumber(countryRollUp_data[i]["confirmed"]) +
                "</text> <br> <text>" + "Confirmed Deaths: " + formatNumber(countryRollUp_data[i]["deaths"]) + "</text>");
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
  getMarketData()
  map.removeLayer(geojsonLayer);


  // Removes all list components to assign new ones
  var lis = document.querySelectorAll('#list li');
  for (var i = 0; li = lis[i]; i++) {
    li.parentNode.removeChild(li);
  };


  // Gets selected epidemic value
  var ele = document.getElementsByName("epidemic");
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      if (ele[i].value == "covid-19") {
        var epidemic = "corona";
      } else {
        var epidemic = (ele[i].value);
      };
    };
  };
  console.log(epidemic);

  // Recenter map
  map.setView([15, -10], 1.5)

  // Retrive new dates 
  startDate = new Date(document.getElementById("date-1").value);
  endDate = new Date(document.getElementById("date-2").value);
  console.log("Start Date: " + startDate);
  console.log("End Date: " + endDate);

  // Plot new info
  addMapLayers(startDate, endDate, epidemic);

});


function getMarketData() {
  var startDate = document.getElementById("date-1").value
  var endDate = document.getElementById("date-2").value

  // var url = `http://localhost:5000/api/v1.0/index/market`;

  d3.csv("data_sets/marketdata/markets.csv").then(function (data) {
    console.log("from data");
    //Create Array Variables to store data
    var dji_dates = [];
    var dji_close = [];
    var ftse_dates = [];
    var ftse_close = [];
    var n225_dates = [];
    var n225_close = [];

    console.log(startDate);
    console.log(endDate);
    //Filter array based on dates
    console.log(data);
    var filteredData = data.filter(series => new Date(series.timestamp) > new Date(startDate) & new Date(series.timestamp) < new Date(endDate));
    console.log(filteredData)
    //Filter array based on market index
    
    var DJIData = filteredData.filter(dji => dji.ticker == 'DJI');
    var FTSEData = filteredData.filter(ftse => ftse.ticker == 'FTSE');
    var N225Data = filteredData.filter(n225 => n225.ticker == 'N225');

  
    DJIData.forEach((DJIData) => {
      Object.entries(DJIData).forEach(([key, value]) => {
        console.log(DJIData);
        // Use the key to determine which array to push the value to
        if (key === "timestamp") {
          dji_dates.push(value);
        }
        if (key === "close") {
          if (value !=0){
          dji_close.push(value);
          }
        }
      });
    });

    FTSEData.forEach((FTSEData) => {
      Object.entries(FTSEData).forEach(([key, value]) => {
        // Use the key to determine which array to push the value to
        if (key === "timestamp") {
          ftse_dates.push(value);
        }
        if (key === "close") {
          if (value !=0){
          ftse_close.push(value);
          }
        }
      });
    });

    N225Data.forEach((N225Data) => {
      Object.entries(N225Data).forEach(([key, value]) => {
        // Use the key to determine which array to push the value to
        if (key === "timestamp") {
          n225_dates.push(value);
        }
        if (key === "close") {
          if (value !=0){
            n225_close.push(value);
          }
        }
      });
    });


    var layout = {
      showlegend: true,
      legend: {
        x: 0,
        y: 1.5
      },
      yaxis: {
        autorange: true
      },
      autosize: true
    };

    //Plot Dow Jones Industrial Average
    var traceDJI = {
      type: "scatter",
      mode: "lines",
      name: "Dow Jones Industrial",
      x: dji_dates,
      y: dji_close,
      line: {
        color: "#1b64ae"
      }
    };
    var plotDJI = [traceDJI];
    Plotly.newPlot('market1', plotDJI, layout);

    //Plot FTSE
    var traceFTSE = {
      type: "scatter",
      mode: "lines",
      name: "FTSE 100",
      x: ftse_dates,
      y: ftse_close,
      line: {
        color: "#0990d1"
      }
    };
    var plotFTSE = [traceFTSE];
    Plotly.newPlot('market2', plotFTSE, layout);

    //Plot Nikkei 225
    var traceN225 = {
      type: "scatter",
      mode: "lines",
      name: "Nikkei 225",
      x: n225_dates,
      y: n225_close,
      line: {
        color: "#1f497d"
      }
    };
    var plotN225 = [traceN225];
    Plotly.newPlot('market3', plotN225, layout);
  });
}

//Function to unpack array of items
function unpack(rows, index) {
  return rows.map(function (row) {
    return row[index];
  });
}

//Populate all charts on page load
getMarketData();



