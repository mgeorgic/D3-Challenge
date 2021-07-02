// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 20,
  bottom: 70,
  left:  80
};

var width = svgWidth - margin.left - margin.right + 10;
var height = svgHeight - margin.top - margin.bottom + 10;

// Create an SVG wrapper, append an SVG group to display chart, and set margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial params with variables
var chosenXAxis = "smokes";
var chosenYAxis = "age";

// function for changing the x-axis scaling when click is made
function xScale(censusData, chosenXAxis) {
  // Set the scales
  var xAxisScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xAxisScale;

}

//  function for changing the y-axis scaling when click is made
function yScale(censusData, chosenYAxis) {
  // Set the scales
  var yAxisScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
    d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yAxisScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(100)
    .call(leftAxis);

  return yAxis;
}

// function to update circles group 
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(100)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function to update circle text group 

function renderXCircleText(textCircles, newXScale, chosenXAxis) {

  textCircles.transition()
    .duration(100)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return textCircles;
}

function renderYCircleText(textCircles, newYScale, chosenYAxis) {

  textCircles.transition()
    .duration(100)
    .attr("y", d => newYScale(d[chosenYAxis])+4);

  return textCircles;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "smokes") {
    xlabel = "Smokers:"
  }
  else if (chosenXAxis === "healthcare") {
    xlabel = "No Healthcare:"
  }
  else {
    xlabel = "Obese:";
  }


  if (chosenYAxis === "age") {
    ylabel = "Age:"
  }
  else if (chosenYAxis === "income") {
    ylabel = "Income:"
  }
  else {
    ylabel = "Poverty:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([40, 60])
    .html(function(d) {
      return (`<strong>${d.state}</strong>
              <br>${xlabel} ${d[chosenXAxis]}
              <br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  //Add a mouseover and out event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })

    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Read in the csv data and error handler
// Async function to return values
(async function(){
    var censusData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))
    
    // Parse the data and convert CSV data to integers
    censusData.forEach(function(data) {
      data.id = +data.id;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });
    
    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      // .attr("transform")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "MidnightBlue")
      .attr("opacity", ".65");

    // append text (state abbreviation) to inside of circles 
    var textCircles = chartGroup.append("g")
      .selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis])+4)
      .attr("font-family", "garamond")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("fill", "lavender")
      .attr("font-weight", "bold");

    // Create group for the three x-axis choices
    // Set the values to grab for each event 
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 30})`);

    var smokesLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "smokes")
      .classed("active", true)
      .text("Smokers (%)");

    var healthcareLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "healthcare") 
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");      

    var obesityLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "obesity") 
      .classed("inactive", true)
      .text("Obesity (%)");

    // Create group for three x-axis labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    var ageLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (height / 2))      
      .attr("value", "age") 
      .classed("active", true)
      .text("Age (Median)");

    var incomeLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 35)
      .attr("x", 0 - (height / 2))
      .attr("value", "income")
      .classed("inactive", true)
      .text("Houshold Income (Median)");

    var povertyLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 55)
      .attr("x", 0 - (height / 2))
      .attr("value", "poverty")
      .classed("inactive", true)
      .text("Poverty (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var xValue = d3.select(this).attr("value");
        if (xValue !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = xValue;

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);

          // updates circles and circle text with new x values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
          textCircles = renderXCircleText(textCircles, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "healthcare") {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var yValue = d3.select(this).attr("value");
        if (yValue !== chosenYAxis) {

          // replaces chosenXAxis with value
          chosenYAxis = yValue;

          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(censusData, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles and circle text with new y values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
          textCircles = renderYCircleText(textCircles, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenYAxis === "income") {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "poverty") {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
})()