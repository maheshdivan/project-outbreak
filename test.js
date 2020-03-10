
var geoJSON = "data/countries.geojson";
// function to fecth JSON
function fetchJSON(url) {
  return fetch(url)
    .then(function (response) {
      return response.json();
    });
}
var data = fetchJSON(geoJSON)
  .then(function (data) { return data })
console.log(data)

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

  var ebola_array = [];
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

console.log(ebola_array);

d3.json(geoJSON, function (data) {

  L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling

      for (var i = 0; i < ebola_array[0].length; i++) {
        if (ebola_array[0][i] == feature.properties.ADMIN) {
          feature.properties.confirmed_cases = ebola_array[1][i];
        };
      };
    }

  });
  console.log(feature.properties.ADMIN);
  console.log(feature.properties.confirmed_cases);
});