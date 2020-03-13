// d3.selectAll("#date-1").on("change")
// d3.selectAll("#date-2").on("change",getData_e)
var boxes = d3.selectAll("input.checkbox:checked")
console.log(boxes)
d3.selectAll("#date-1").on("change")
d3.selectAll("#date-2").on("change",getData_c)
var final_data=[]
var final_data_1=[]
epidemic="Ebola";

function getData_e(){
    var selection_1=document.getElementById('date-1').value;
    var selection_2=document.getElementById('date-2').value;
    // if (selection_1 > selection_2){
    //     alert("Date from should be less or equal to Date to")
    // }
    console.log("Date from select is ",selection_1)
    console.log("Date to select is ",selection_2)
    queryurl=`http://0.0.0.0:5000/api/v1.0/epidemic/ebola`
    d3.json(queryurl).then(function(data) {
      for (i=0;i<data.length;i++){
        
         if (data[i][1] > selection_1 & data[i][1]<selection_2 ) {
            final_data.push({
               country: data[i][0],
               date: data[i][1],
               confirm: data[i][4],
               death: data[i][8]
            })
         }   
      }
      console.log("Length of final",final_data)
     var totalByDate=d3.nest()
              .key(function(d){return d.date})
              .rollup(function(v){return {
                  total_case: d3.sum(v,function(d){return d.confirm}),
                  total_death:d3.sum(v,function(d){return d.death})
              } })
              .entries(final_data )
     console.log("totalByDate", totalByDate)
   //  var total_cases= JSON.stringify(totalByDate)
     //console.log(total_cases[0])
     var titles = totalByDate.map(dates =>  dates.key);
     var conf_case=totalByDate.map(dates =>  dates.value["total_case"])
     var conf_death=totalByDate.map(dates =>  dates.value["total_death"])
    // console.log(conf_death)         
     var trace1 = {
      type: "scatter",
      mode: "lines",
      name: epidemic+"Confirmed_Cases",
      x: titles,
      y: conf_case,
      line: {
        color: "#00796B"
      }
    };
    var trace2 = {
       type: "scatter",
       mode: "lines",
       name: epidemic+"Confirmed_death",
       x: titles,
       y: conf_death,
       line: {
         color: "#DC1A0E"
       }
     };
    var data = [trace1,trace2];
    Plotly.newPlot("plot1", data);
   
   //   var x_axis = totalByDate["key"]
   //   console.log("Xaxis",x_axis)
     })
   }
   function getData_c(){
    epidemic ="Corona"
    var selection_1=document.getElementById('date-1').value;
    var arr1 = selection_1.split("-") 
    arr1[0] = arr1[0]-2000
    console.log(arr1[2])
    selection_1 = arr1[1].toString()+"/"+arr1[2].toString()+"/"+arr1[0].toString()
    var selection_2=document.getElementById('date-2').value;
    var arr1 = selection_2.split("-") 
    arr1[0] = arr1[0]-2000
    console.log(arr1[2])
    selection_2 = arr1[1].toString()+"/"+arr1[2].toString()+"/"+arr1[0].toString()
    // if (selection_1 > selection_2){
    //     alert("Date from should be less or equal to Date to")
    // }
    console.log("Date from select is ",selection_1)
    console.log("Date to select is ",selection_2)
    queryurl=`http://0.0.0.0:5000/api/v1.0/epidemic/corona`
    d3.json(queryurl).then(function(data) {
      for (i=0;i<data.length;i++){
        
         if (new Date(data[i][4]) > new Date(selection_1) & new Date(data[i][4]) < new Date(selection_2) ) {
            console.log("I am inside")
            final_data_1.push({
               country: data[i][1],
               date: data[i][4],
               confirm: data[i][5],
               death: data[i][7]
            })
         }   
      }
      console.log("Length of final",final_data_1.length)
     var totalByDate=d3.nest()
              .key(function(d){return d.date})
              .rollup(function(v){return {
                  total_case: d3.sum(v,function(d){return d.confirm}),
                  total_death:d3.sum(v,function(d){return d.death})
              } })
              .entries(final_data_1 )
     //console.log("totalByDate", totalByDate)
     var total_cases= JSON.stringify(totalByDate)
     //console.log(total_cases[0])
     var titles = totalByDate.map(dates =>  dates.key);
     var conf_case=totalByDate.map(dates =>  dates.value["total_case"])
     var conf_death=totalByDate.map(dates =>  dates.value["total_death"])
    // console.log(conf_death)         
     var trace1 = {
      type: "scatter",
      mode: "lines",
      name: epidemic+"Confirmed_Cases",
      x: titles,
      y: conf_case,
      line: {
        color: "#00796B"
      }
    };
    var trace2 = {
       type: "scatter",
       mode: "lines",
       name: epidemic+"Confirmed_death",
       x: titles,
       y: conf_death,
       line: {
         color: "#DC1A0E"
       }
     };
    var data = [trace1,trace2];
    Plotly.newPlot("plot", data);
   
   //   var x_axis = totalByDate["key"]
   //   console.log("Xaxis",x_axis)
     })
   }