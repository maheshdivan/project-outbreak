var apiKey = "5GHY1AE5BGE4O8HT";
var ticker = "DJI";


var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`;

d3.json(url).then(function (data) {
  var timeSeries = data["Time Series (Daily)"]
  var metaData = data["Meta Data"]
  console.log(timeSeries);
  // console.log(metaData);

  // Grab values from the data json object to build the plots
  var name = metaData["2. Symbol"];
  var open = [];
  var close = [];
  var high = [];
  var low = [];
  var dates = [];
  var volume = [];

   // Iterate through each key and value
  Object.entries(timeSeries).forEach(([key, valueObject]) => {
        // Use the key to determine which array to push the value to
      dates.push(key);
      var counter = 1;
    // Iterate through objects and record values
      Object.entries(valueObject).forEach(([key2, value]) => {
      if (counter == 1) {
          open.push(value);
      }
      if (counter ==2)  {
          high.push(value)
      }
      if (counter == 3) {
        low.push(value)
      }
      if (counter == 4) {
        close.push(value);
      }
      if (counter == 5) {
        volume.push(value);
      }
      counter ++
  });
  });

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: name,
    x: dates,
    y: close,
    line: {
      color: "#17BECF"
    }
  };

  var data = [trace1];

  var layout = {
    title: `${ticker} closing prices`,
    xaxis: {
      type: "date"
    },
    yaxis: {
      autorange: true,
      type: "linear"
    }
  };

  var config = {
    responsive: true
  };

  Plotly.newPlot("line-id", data, layout, config);

});