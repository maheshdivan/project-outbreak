

var cbs = document.querySelectorAll('input[type=radio]');
for(var i = 0; i < cbs.length; i++) {
    cbs[i].addEventListener('change', function() {
        if(this.checked)
            switch(this.value){
              case 'ebola':
                console.log("Inside Ebola")
                ebola()
                break
              case 'covid-19':
                console.log("Inside Corona")
                corona()
                break 
            }
    });
}

// d3.selectAll("#date-1").on("change")
// d3.selectAll("#date-2").on("change",getData_e)

function ebola(){
  var submit = d3.select("#submit-btn")
  console.log(submit)
  submit.on("click", function (){

    startDate = new Date(document.getElementById("date-1").value);
    endDate = new Date(document.getElementById("date-2").value);
    getData_e(startDate,endDate)
  })
}


function corona(){
  var submit = d3.select("#submit-btn")
  submit.on("click", function (){
    startDate = new Date(document.getElementById("date-1").value);
    endDate = new Date(document.getElementById("date-2").value);
    getData_c(startDate,endDate)
  })
}

// var final_data=[]
// var final_data_1=[]

function getData_e(selection_1,selection_2){
    epidemic ="Ebola"
    var selection_1=document.getElementById('date-1').value;
    var arr1 = selection_1.split("/") 
    selection_1=arr1[2].toString()+"-"+arr1[0].toString()+"-"+arr1[1].toString()

    var selection_2=document.getElementById('date-2').value;
    var arr1 = selection_2.split("/") 
    selection_2=arr1[2].toString()+"-"+arr1[0].toString()+"-"+arr1[1].toString()


    // if (selection_1 > selection_2){
    //     alert("Date from should be less or equal to Date to")
    // }

    console.log("Date from select is ",selection_1)
    console.log("Date to select is ",selection_2)
    data = {}
    final_data=[]
    queryurl=`http://0.0.0.0:5000/api/v1.0/epidemic/ebola`
    d3.json(queryurl).then(function(data) {
      
      for (i=0;i<data.length;i++){
        
         if (data[i][0] > selection_1 & data[i][0]<selection_2 ) {
            console.log("I am inside")
            console.log(data[i][0])
            final_data.push({
               country: data[i][1],
               date: data[i][0],
               confirm: data[i][2],
               death: data[i][3]
            })
         }   
      }

      console.log("Length of final",final_data)

     var totalByDate=d3.nest()
              .key(function(d){
                return d.date
              })
              .rollup(function(v){
                return {
                  total_case: d3.sum(v,function(d){return d.confirm}),
                  total_death:d3.sum(v,function(d){return d.death})
                } 
              })
              .entries(final_data);
     console.log("totalByDate", totalByDate);
   //  var total_cases= JSON.stringify(totalByDate)
     //console.log(total_cases[0])

     var titles = totalByDate.map(dates =>  dates.key);
     var conf_case=totalByDate.map(dates =>  dates.value["total_case"]);
     var conf_death=totalByDate.map(dates =>  dates.value["total_death"]);
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

    Plotly.newPlot("bar-id", data);
   
   //   var x_axis = totalByDate["key"]
   //   console.log("Xaxis",x_axis)
     })


   }

   function getData_c(selection_1,selection_2){

    epidemic ="Corona"

    var selection_1=document.getElementById('date-1').value;
    console.log(selection_1)
    var arr1 = selection_1.split("/") 
    arr1[2] = arr1[2]-2000
    console.log(arr1[2])
    selection_1 = arr1[0].toString()+"/"+arr1[1].toString()+"/"+arr1[2].toString()

    var selection_2=document.getElementById('date-2').value;
    var arr1 = selection_2.split("/") 
    arr1[2] = arr1[2]-2000
    console.log(arr1[2])
    selection_2 = arr1[0].toString()+"/"+arr1[1].toString()+"/"+arr1[2].toString()

    // if (selection_1 > selection_2){
    //     alert("Date from should be less or equal to Date to")
    // }

    console.log("Date from select is ",selection_1)
    console.log("Date to select is ",selection_2)
    data = {}
    final_data_1=[]
    queryurl=`http://0.0.0.0:5000/api/v1.0/epidemic/corona`
    d3.json(queryurl).then(function(data) {
      for (i=0;i<data.length;i++){
        
         if (new Date(data[i][0]) > new Date(selection_1) & new Date(data[i][0]) < new Date(selection_2) ) {

            console.log("I am inside")
            final_data_1.push({
               country: data[i][1],
               date: data[i][0],
               confirm: data[i][2],
               death: data[i][3]
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

    Plotly.newPlot("bar-id", data);
   
   //   var x_axis = totalByDate["key"]
   //   console.log("Xaxis",x_axis)
     })


   }