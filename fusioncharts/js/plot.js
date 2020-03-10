let fusionDataStore = new FusionCharts.DataStore();
let fusionTable = fusionDataStore.createDataTable(data, schema);

    new FusionCharts({
      type: 'timeseries',
      renderAt: 'container',
      width: "100%",
      height: 750,
      dataSource: {
        data: fusionTable,
        chart: {
        },
        caption: {
          text: 'Stock Market Performance'
        },
        yAxis: [{
            "plot": {
                "value": "Close",
                "connectnulldata": "true"
            }
        }],
        "series": "Index"
      }
    }).render()