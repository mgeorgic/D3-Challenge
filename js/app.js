
// @TODO: YOUR CODE HERE!
// Resize and where to put your code for the scatter plot

var svgArea = d3.select("#scatter").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
svgArea.remove();
}

svgWidth = document.getElementById('scatter').clientWidth;
svgHeight = svgWidth / 1.45;

var border= 1.5;
var bordercolor='dark blue';

