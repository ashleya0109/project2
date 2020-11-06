var selectedCategory;

function datafilter(value) {
    d3.selectAll("svg").remove();
    
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

      var selectedASIN = value;


// Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("Data.csv").then(function(fullData) {
  console.log(selectedCategory);
  fullData = fullData.filter(function(d) 
  { 
    return  (d.ASIN == selectedASIN & d.Category == selectedCategory) 

  })
  console.log(fullData)

  
  // Step 1: Set up our chart
//= ================================
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

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#priceChart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  var parseTime = d3.timeParse("%d-%b");

  // Format the data
  fullData.forEach(function(data) {
    data.Day = parseTime(data.Day);
    data.Price = +data.Price;
    data.Rank = +data.Rank;
  });

  function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return a.Day - b.Day;
}


  fullData = fullData.sort(sortByDateAscending); 

  console.log(fullData)
  // Step 5: Create the scales for the chart
  // =================================
  // Step 5: Create the scales for the chart
  // =================================
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(fullData, data => data.Day))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // find the max of the morning data
  var PriceMax = d3.max(fullData, data => data.Price);


  var yMax = PriceMax;

  // var yMax = morningMax > eveningMax ? morningMax : eveningMax;

  // Use the yMax value to set the yLinearScale domain
  yLinearScale.domain([0, yMax]);


  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b")).ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a drawLine function which will use our scales to plot the line's points
    var drawLine = d3
    .line()
    .x(data => xTimeScale(data.Day))
    .y(data => yLinearScale(data.Price));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for milesData
    .attr("d", drawLine(fullData))
    .classed("line", true)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  // Append an SVG group element to the SVG area, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

    chartGroup.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Date of Data Pull");

    chartGroup.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Price Per Day");

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis);

    var rSVG = d3.select("#ranking")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  // Append a group area, then set its margins
  var rchartGroup = rSVG.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var ryLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // find the max of the morning data
  var rRankMAx = d3.max(fullData, data => data.Rank);


  var ryMax = rRankMAx;

  // var yMax = morningMax > eveningMax ? morningMax : eveningMax;

  // Use the yMax value to set the yLinearScale domain
  ryLinearScale.domain([0, ryMax]);


  // Step 7: Create the axes
  // =================================
  var rbottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b")).ticks(7);
  var rleftAxis = d3.axisLeft(ryLinearScale);

    // Configure a drawLine function which will use our scales to plot the line's points
    var rdrawLine = d3
    .line()
    .x(data => xTimeScale(data.Day))
    .y(data => ryLinearScale(data.Rank));

  // Append an SVG path and plot its points using the line function
  rchartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for milesData
    .attr("d", rdrawLine(fullData))
    .classed("line", true)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  // Append an SVG group element to the SVG area, create the left axis inside of it
  rchartGroup.append("g")
    .classed("axis", true)
    .call(rleftAxis);

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  rchartGroup.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(rbottomAxis);

    rchartGroup.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Date of Data Pull");

    rchartGroup.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Ranking Per Day");

  })

  d3.csv("UnqASIN.csv").then(function(uA) {
    uA=uA.filter(function(d) 
    { 
      return  (d.Category == selectedCategory & d.ASIN == selectedASIN) 

    });
    
    if (uA.length == 0) document.getElementById("desc").innerHTML = "<h1>NA</h1>";
      else {
         var catOptions = "";
         for (var i = 0; i < uA.length; i++) {
          var Title = uA[i].Title;
          var Avg_Reviews = uA[i].Avg_Reviews;
          var Rating = uA[i].Rating;
          var Avg_Price = uA[i].Rating_Fill;
          catOptions += "<h1>" + Title + "</h1><br/><p><b>Total Reviews: </b>"+ Avg_Reviews+"<br/><b>Average Daily Price: </b>" + Avg_Price +"<br/><b>Rating: </b>" +Rating +" out of 5<br/></p>"
             
         }
         document.getElementById("desc").innerHTML = catOptions;
     }




  })



    


}
  
  function changecat(value) {
    selectedCategory = value;
    console.log(value);
    
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

     
    })
  
  }

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
