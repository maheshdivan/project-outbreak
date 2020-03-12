// Function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Set Epidemic parameters for API
var epidemic = "corona"
queryurl = `http://0.0.0.0:5000/api/v1.0/epidemic/` + epidemic
console.log(queryurl)


/////////////////////// DATES TO TEST ///////////////////////
startDate = new Date(2020, 01, 20);
endDate = new Date(2020, 01, 30);
console.log("Start Date: " + startDate);
console.log("End Date: " + endDate);

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


  /////// Print out top 10 countries with confirmed cases data ///////
  // Sort data from highest to lowest confirmed cases
  var sorted_data = countryRollUp_data.sort(function (a, b) {
    return b.confirmed - a.confirmed;
  });

  // If statement to only get the top 10 countries, len = 9 since 0 is counted
  if (sorted_data.length > 9) {
    len = 9;
  } else {
    len = sorted_data.length;
  }
  console.log(len)
  // Loop through sorted data and print info our
  for (var i = 0; i < len; i++) {
    console.log("Country: " + sorted_data[i]['country'] + 
    "   Confirmed cases: " + formatNumber(sorted_data[i]['confirmed']) + 
    "   Confirmed deaths: "  + formatNumber(sorted_data[i]['deaths']))
  };

});


// Getting a reference to the submit button
var submit = d3.select("#submit-btn");

// Retrieving date when button is clicked
submit.on("click", function () {
  // Remove already plotted layer
  // map.removeLayer(geojsonLayer);

  // Recenter map
  // map.setView([15, -10], 1.5)

  // Retrive new dates 
  startDate = new Date(document.getElementById("date-1").value);
  endDate = new Date(document.getElementById("date-2").value);
  console.log("Start Date: " + startDate);
  console.log("End Date: " + endDate);

  // Plot new info
  // addMapLayers(startDate, endDate);
});

