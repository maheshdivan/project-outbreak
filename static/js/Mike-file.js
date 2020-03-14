//On button submit, reolad charts
console.log("tes");

d3.select("#submit-btn").on("click", function () {
  getMarketData();
})


//Function to call Flask API and retrieve market data information
function getMarketData() {
  // var startDate = document.getElementById("date-1").value
  // var endDate = document.getElementById("date-2").value

  startDate = new Date(document.getElementById("date-1").value);
  endDate = new Date(document.getElementById("date-2").value);
  console.log(startDate)
  console.log(endDate)

  // var url = `http://localhost:5000/api/v1.0/index/market`;
  // var url = 'http://0.0.0.0:5000/api/v1.0/index/DJI';
  var csv_file = '/data_sets/marketdata/markets.csv'
  console.log("data");

  d3.csv(csv_file).then(function (data) {
    console.log(data);
    //Create Array Variables to store data
    var dji_dates = [];
    var dji_close = [];
    var ftse_dates = [];
    var ftse_close = [];
    var n225_dates = [];
    var n225_close = [];

    //Filter array based on dates
    var filteredData = data.filter(series => new Date(series[1]) >= new Date(startDate) && new Date(series[1]) <= new Date(endDate));
    console.log(filteredData)
    //Filter array based on market index
    var DJIData = filteredData.filter(dji => dji[0] == 'DJI');
    for (i = 0; i < DJIData.length; i++) {
      dji_dates = unpack(DJIData, 1);
      dji_close = unpack(DJIData, 5);
    }
    var FTSEData = filteredData.filter(ftse => ftse[0] == 'FTSE');
    for (i = 0; i < FTSEData.length; i++) {
      ftse_dates = unpack(FTSEData, 1);
      ftse_close = unpack(FTSEData, 5);
    }
    var N225Data = filteredData.filter(n225 => n225[0] == 'N225');
    for (i = 0; i < N225Data.length; i++) {
      n225_dates = unpack(N225Data, 1);
      n225_close = unpack(N225Data, 5);
    }
    //Plot each market index
    var checkBox_us = document.getElementById("us");
    var checkBox_eur = document.getElementById("europe");
    var checkBox_asia = document.getElementById("asia");
    makePlot('Dow Jones Industrial', dji_dates, dji_close, 'market1', '#1f497d');
    makePlot('FTSE', ftse_dates, ftse_close, 'market2', '#0a8fd0');
    makePlot('Nikkei 225', n225_dates, n225_close, 'market3', '#6abff8');
  });
};
//Function to Plot Values.  Passing the Index, array of dates/close, div to plot and color
function makePlot(marketIndex, marketDates, marketClose, location, color) {
  //Set appropriate layout
  var layout = {
    showlegend: true,
    legend: {
      x: 0,
      y: 1.5
    },
    yaxis: {
      autorange: true
    }
  };
  //Create the Plotly Object of values and options
  var trace = {
    type: "scatter",
    mode: "lines",
    name: marketIndex,
    x: marketDates,
    y: marketClose,
    line: {
      color: color
    }
  };
  var plotTrace = [trace];
  Plotly.newPlot(location, plotTrace, layout);
}
//Alternate using onclick="showMe('market2')" in HTML
// function showMe(box) {
//     var chboxs = document.getElementsByName("market");
//     console.log(chboxs);
//     var vis = "block";
//     for (var i = 0; i < chboxs.length; i++) {
//         if (chboxs[i].checked) {
//             vis = "none";
//             break;
//         }
//     }
//     document.getElementById(box).style.display = vis;
// }
//Function to unpack array of items
function unpack(rows, index) {
  return rows.map(function (row) {
    return row[index];
  });
}
//Populate all charts on page load
// getMarketData();