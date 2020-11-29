
// define dimensions
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// define svg
var svg = d3
    .select("#simpleBubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// initial params
var yearSelect = "2019";
var filtered;

// create a tooltip
var Tooltip = d3.select("#simpleBubble")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

// Three functions that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
    Tooltip
        .style("opacity", 1)
};

var mousemove = function (d) {
    Tooltip
        .html('<u>' + d.Country + '</u>' + "<br>" + " happiness score: " + parseFloat(d.Happiness_Score) + "<br>" + " Year: " + parseFloat(d.Year))
        .style("left", (d3.mouse(this)[0] + 20) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
};

var mouseleave = function (d) {
    Tooltip
        .style("opacity", 0)
};

var allData;

// import data
d3.csv("/Data/data.csv").then(function (happyData) {

    console.log(happyData)

    happyData.forEach(function (data) {
        data.Happiness_Score = +data.Happiness_Score;
        data.Year = +data.Year;
    });

    allData = happyData;

    makeGraph("#simpleBubble", allData)
});

function makeGraph(elementID, happyData) {

    // filtered data
    filtered = happyData.filter(data => (data.Year == d3.select("#year-input").property("value")));
    console.log(filtered)

    // set color scale
    var colorScore = d3.scaleOrdinal()
        .domain([0.0, 9.0])
        .range(d3.schemeSet1);

    // Size scale for happiness
    var size = d3.scaleLinear()
        .domain([0.0, 9.0])
        .range([7, 55]);  // circle will be between 7 and 55 px wide

    // What happens when a circle is dragged?
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    };

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    };

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.Happiness_Score) + 3) }).iterations(1)) // Force that avoids circle overlapping

    simulation
    .nodes(filtered)
    .on("tick", function (d) {
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
    }
    );

    var node = svg.append("g")
        .selectAll("circle")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return size(d.Happiness_Score) })
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function (d) { return colorScore(d.Happiness_Score) })
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
}

var elem = document.getElementById('year-input')
console.log(elem)
elem.addEventListener("change", onSelectChange)

function onSelectChange() {
    var value = this.value;
    console.log(value)
    var fdata = allData.filter(data => (data.Year == value));
    console.log(fdata)
    d3.select("svg").selectAll("*").remove();
    makeGraph("#simpleBubble", fdata);
};

