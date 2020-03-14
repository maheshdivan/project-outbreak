// Set default Date Values
// document.getElementById("date-1").value = "9/1/14"
// document.getElementById("date-2").value = "3/1/18"
// Retrieve Date Value from Input Fields
startDate = document.getElementById("date-1").value
endDate = document.getElementById("date-2").value
//Event Listener for Date Change on Submit
// document.getElementById("submit-btn").addEventListener("submit", getData("DJI"));
var ticker = "DJI";
// var url = `http://localhost:5000/api/v1.0/index/`;
var name = [];
var dates = [];
var m_open = [];
var high = [];
var low = [];
var m_close = [];
var adjclose = [];
var volume = [];
//Function to call Flask API and retrieve market data information
function getData(market_id) {
  var url = `http://localhost:5000/api/v1.0/index/`;
  d3.json(url + market_id).then(function (data) {
    //filter array based on dates
    var filteredData = data.filter(series => new Date(series[1]) >= new Date(startDate) && new Date(series[1]) <= new Date(endDate));
    console.log(filteredData);
    for (i = 0; i < filteredData.length; i++) {
      // Grab values from the data object to build the plots.
      //Unpacking all values in case we want to use them later.
      name = unpack(filteredData, 0);
      dates = unpack(filteredData, 1);
      m_open = unpack(filteredData, 2);
      high = unpack(filteredData, 3);
      low = unpack(filteredData, 4);
      m_close = unpack(filteredData, 5);
      adjclose = unpack(filteredData, 6);
      volume = unpack(filteredData, 7);
    }
    //Switch to retrieve specific market data and plot in respective div
    // switch (market_id) {
    //   case 'DJI':
    //     makePlot('line-id');
    //     break;
    //   case 'FTSE':
    //     makePlot('line-id2')
    //     break;
    //   case 'HSI':
    //     makePlot('line-id3');
    //     break;
    // }
    makePlot()
  });
}
//Function to unpack array of items
function unpack(rows, index) {
  return rows.map(function (row) {
    return row[index];
  });
}
//Plot market data time series
function makePlot() {
  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: ticker,
    x: dates,
    y: m_close,
    line: {
      color: "#DC1A0E"
    }
  };
  var plotData = [trace1];
  Plotly.newPlot('market1', plotData);
}
// function sleep(milliseconds) {
//   const date = Date.now();
//   let currentDate = null;
//   do {
//     currentDate = Date.now();
//   } while (currentDate - date < milliseconds);
// }
// Retrieve and plot market data for each index
getData('DJI');
// sleep(3000);
// getData('FTSE');
// getData('FTSE');
// getData('HSI');
// Alternate method to retrieve and plot market data for each index, neither is working
// marketIndexes = ['DJI', 'FTSE'];
// for (i=0; marketIndexes.length; i++){
//    getData(marketIndexes[i])
//  };