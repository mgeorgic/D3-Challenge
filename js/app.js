
// @TODO: YOUR CODE HERE!

// clear svg is not empty
if (!svgArea.empty()) {
svgArea.remove();
}

// Set svg wrapper dimensions 
var svgWidth = 900;
var svgHeight = 600;
var margin = { top: 100, right: 60, bottom: 100, left:60};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper to scatter, append SVG group, resize left and top margins.
var svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/// Append an SVG Group, shift by left and top margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

/// Choose what to name x and y axis
var chosenXaxis = "poverty";
var chosenYaxis = "smokes";

/// Grab CSV data
var file = "../data/data.csv"
console.log(d3.csv(file))
d3.csv(file).then(successHandle, errorHandle);

// Error handler, if missing data
function errorHandle(error){
    throw error;
}

// If there is state data then filter state data for poverty and smokes
function successHandle(stateGroup) {
    /// Parse Data
    stateGroup.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });
    
        /// Scale axis, as big as needed based on data
        var xLinearScale = xScale(stateData, chosenXaxis);
        var yLinearScale = yScale(stateData, chosenYaxis);
    
        /// Initial axis 
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        /// Append X Axis
        var xAxis = chartGrouped.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        var xLabel = chartGrouped.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .attr("x", 0 )
            .attr("y", 20)
            .attr("value", "smokes")
            .attr("class", "axis-text")
            .classed("active", true)
            .classed("inactive", false)
            .text("Smokes (%)");

        