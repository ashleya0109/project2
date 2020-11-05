

function datafilter(value) {
    d3.select("svg").remove();
    
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 600 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
    var svg = d3.select("#wordcloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
          
    
        d3.csv("keywords.csv").then(function(myWords) {

      

    // Load data 
        var filterWords = myWords.filter(function(d) 
        { 
          return  (d.ASIN == value) 

        })
        console.log(filterWords);
        
       var layout = d3.layout.cloud()
      .size([width, height])
      .words(filterWords.map(function(d) { return {text: d.Word}; }))
      .padding(5)        //space between words
      .rotate(0)
      .fontSize(function() { return~~(Math.random() * (25-12)+12); })       // font size of words
      .on("end", draw);
      layout.start();

      

      function draw(words) {
        svg.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return d.size; })
              .style("fill", getRandomColor)
              .attr("text-anchor", "middle")
              .style("font-family", "Impact")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.text; });
      }

      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      })




// Get the data
d3.csv("Data.csv").then(function(priceFilter){
  console.log(priceFilter);

  var parseDate = d3.utcParse("%d-%m-%y");

  
  priceFilter.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Price = +d.Price;
        d.ASIN = +d.ASIN;
    });
    console.log(priceFilter);

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time

var svg = d3.select("#priceChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
// Set the ranges
var x = d3.range([0, width]);
var y = d3.range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
// Adds the svg canvas


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.Price; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
      .filter(function(d) { return d.ASIN == value })
        .style("fill", "red")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.close); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});


    }
  
  function changecat(value) {
    console.log(value)
    
    d3.csv("UnqASIN.csv").then(function(ctgyASIN) {
      var ASIN = ctgyASIN.filter(function(d) 
      { 
        return  (d.Category == value) 
  
      });

      
      if (value.length == 0) document.getElementById("category").innerHTML = "<option></option>";
      else {
         var catOptions = "";
         for (var i = 0; i < ASIN.length; i++) {
          var record = ASIN[i].ASIN;
          catOptions += "<option>" + record + "</option>"
             
         }
         document.getElementById("category").innerHTML = catOptions;
     }
    }
    )}


    // Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};



// Load data from forcepoints.csv
