//On button submit, reolad charts
d3.select("#submit-btn").on("click", function () {
  getMarketData();
  console.log("Clicked");
})


//Function to call Flask API and retrieve market data information
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
          dji_close.push(value);
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
          ftse_close.push(value);
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
          n225_close.push(value);
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
