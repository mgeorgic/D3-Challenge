
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
        
        /// Append X-axis to smokes(%) group
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
        
        /// Append Y-axis to poverty group
        var yAxis = chartGrouped.append("g")
            .classed("y-axis", true)
            .call(leftAxis);
        
        var yLabel = chartGrouped.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 -  margin.left + 20)
            .attr("x", 0 - height / 2)
            .attr("value", "poverty")
            .attr("class", "axis-text")
            .classed("active", true)
            .classed("inactive", false)
            .text("In Poverty(%)")
        
            var circleRadius = 15;
    
            /// Append circles for chart
            var circlesGroup = chartGrouped.selectAll("circles")
                .data(stateData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d[chosenXaxis]))
                .attr("cy", d => yLinearScale(d[chosenYaxis]))
                .attr("r", circleRadius)
                .attr("fill", "purple")
                .style("stroke", "lavender")
                .attr("opacity", ".7")
                .text(function(d) {
                    return d.abbr;
                })
        
            /// Append State Abbreviations to Circles
            var abbrGroup = chartGrouped.selectAll("texts")
            .data(stateData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXaxis]))
            .attr("y", d => yLinearScale(d[chosenYaxis]))
            .attr("class","stateText")
            .text(function(d) {
                return d.abbr;
            })
    
    // Axis labels
    var xLabel = "Live in Poverty (%)"
    var yLabel = "Smokes(%)"
    
    //  Create tooltips, assign it a class
    var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([90, 0])
            .html(function(d) {
                 return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[chosenXaxis]}</b><br>${yLabel} <b>${d[chosenYaxis]}</b>`)
            });
            
         
            