//define svg
var svgHeight = 800;
var svgWidth = 1000
//set margins
var margin = {
    top: 10,
    bottom: 30,
    right: 10,
    left: 60,
};
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
//svg wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
//append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
//initial params
var yAxisVar = "Economy";
var yearSelect = "2019";
var xAxisVar = "Happiness_Score"
// var yearSelect = d3.select("#year-input");
var filtered;
var varValue;
//updating yaxis scale
function yScale(filtered, yAxisVar) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(filtered, d => d[yAxisVar]) * 0.8,
        d3.max(filtered, d => d[yAxisVar]) * 1.2
        ])
        .range([chartHeight, 0]);
    return yLinearScale;
};
//updating xaxis scale
function xScale(filtered, xAxisVar) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(filtered, d => d[xAxisVar]) * 0.8,
        d3.max(filtered, d => d[xAxisVar]) * 1.2
        ])
        .range([0, chartWidth]);
    return xLinearScale
};
//updating yaxis
function renderYAxes(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);
​
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
​
    return yAxis;
};
//updating xaxis
function renderXAxes(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);
​
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
​
    return xAxis;
};
​
//updating circles
function renderCircles(circlesGroup, yLinearScale, yAxisVar) {
​
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d[yAxisVar]))
        .attr("cx", d => xLinearScale(d[xAxisVar]))
​
​
    return circlesGroup;
};
// function renderXCircles(circlesGroup, xLinearScale, xAxisVar) {
​
//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => xLinearScale(d[xAxisVar]));
​
//     return circlesXGroup;
// };
//updating ToolTip 
function updateToolTip(yAxisVar, circlesGroup) {
​
    var label;
​
    if (yAxisVar === "Economy") {
        label = "Economy:";
    }
    if (yAxisVar == "Family") {
        label = "Family: ";
    }
    if (yAxisVar === "Health") {
        label = "Health:";
    }
    if (yAxisVar === "Freedom") {
        label = "Freedom:";
    }
    if (yAxisVar === "Trust") {
        label = "Trust:";
    }
    if (yAxisVar === "Generosity") {
        label = "Generosity:";
    };
​
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.Country}<br> Happiness Score: ${d.Happiness_Score}<br>${label} ${d[yAxisVar]}`);
        });
​
    circlesGroup.call(toolTip);
​
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
​
    return circlesGroup;
}
// //updating Chart labels function--right now overwriting previous label
// function updateLabels(yAxisVar, chartGroup) {
//     // chartGroup.text("econ")
//     // chartGroup.append("text")
//     //     .attr("transform", "rotate(-90)")
//     //     .attr("y", 0 - margin.left)
//     //     .attr("x", 0 - (chartHeight / 2))
//     //     .attr("dy", "1em")
//     //     .attr("class", "axisText")
//     //     .text(`${yAxisVar}`)
//         d3.selectAll(chartGroup).text= "something";
// }
​
​
//Initial axis labels
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 15})`)
    .attr("class", "axisText")
    .text(`Happiness Score`);
​
// chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (chartHeight / 2))
//     .attr("dy", "1em")
//     .attr("class", "axisText")
//     .text(`${yAxisVar}`);
​
//import data
d3.csv("/Data/data.csv").then(function (happyData) {
    // var filtered, x, y, yAxisVar, varValue;
    console.log(happyData)
    happyData.forEach(function (data) {
        data.Happiness_Score = +data.Happiness_Score;
        data.Economy = +data.Economy;
        data.Year = +data.Year;
        data.Family = +data.Family;
        data.Health = +data.Health;
        data.Generosity = +data.Generosity;
        data.Freedom = +data.Freedom;
        data.Trust = +data.Trust;
        data.Country = data.Country
​
    });
    //filtered data
    filtered = happyData.filter(data => (data.Year == yearSelect));
​
    //xScale
    // var xAxis = filtered.map(data => data["Happiness_Score"]);
    // var xLinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(xAxis)])
    //     .range([0, chartWidth]);
    var xLinearScale = xScale(filtered, xAxisVar);
    //yScale
    var yLinearScale = yScale(filtered, yAxisVar);
​
    //year event listener
    yearSelect = d3.select("#year-input");
​
​
    //Select year filter
    yearSelect.on("change", () => {
        d3.event.preventDefault();
        xAxisVar = "Happiness_Score"
        var yearValue = yearSelect.property("value");
        filtered = happyData.filter(data => (data.Year == yearValue))
        yLinearScale = yScale(filtered, yAxisVar);
        xLinearScale = xScale(filtered, xAxisVar);
        yAxis = renderYAxes(yLinearScale, yAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderCircles(circlesGroup, yLinearScale, yAxisVar);
        toolTip = updateToolTip(yAxisVar, circlesGroup);
       
        
        // circlesGroup = updateToolTip(circlesGroup, yLinearScale, yAxisVar);
        // circlesGroup = updateLabels(yAxisVar, chartGroup);
        console.log(yearValue);
        console.log(filtered);
​
​
    });
​
​
​
    //create initial params
​
    // var Economy = filtered.map(data => data["Economy"]);
    // console.log(Economy);
​
    // yAxisVar = "Economy"
​
    //function for updating yaxis scale
​
    // ([0, d3.max(yAxisVar)])
    // .range([chartHeight, 0])
​
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
​
    // append y axis --flip location of chart width
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${chartWidth},0)`)
        .call(leftAxis);
​
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
​
    // append x axis
    // chartGroup.append("g")
    //     .call(bottomAxis);
​
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.Happiness_Score))
        .attr("cy", d => yLinearScale(d[yAxisVar]))
        .attr("r", 5)
        .attr("fill", "blue")
        .attr("opacity", ".5");
​
​
    // updateToolTip function above csv import
    //   var circlesGroup = updateToolTip(yAxisVar, circlesGroup);
    // var varSelect = "Economy"
    varSelect = d3.select("#varvar");
​
​
    varSelect.on("change", () => {
        // d3.event.preventDefault();
        // varValue = varSelect.property("value");
​
        yAxisVar = varSelect.property("value");
        // xAxisVar = filtered.map(data => data[xAxisVar])
        // yAxisVar = filtered.map(data => data[varValue]);
        yLinearScale = yScale(filtered, yAxisVar);
        xLinearScale = xScale(filtered, xAxisVar);
        yAxis = renderYAxes(yLinearScale, yAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        // circlesGroup = renderYCircles(circlesGroup, yLinearScale, yAxisVar);
        // circlesGroup = renderXCircles(circlesGroup, xLinearScale, xAxisVar);
        // circlesGroup = updateToolTip(circlesGroup, yAxisVar);
        circlesGroup = renderCircles(circlesGroup, yLinearScale, yAxisVar);
        toolTip = updateToolTip(yAxisVar, circlesGroup);
        // console.log(filtered)
        // yAxisVar = filtered.map(data => data[varValue]); ///could be area for change
        // console.log(varValue);
        console.log(yAxisVar)
        // onUpdate(d3.max(yAxisVar))
​
        //change to on update
        chartGroup = updateLabels(yAxisVar, chartGroup)
        // chartGroup.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (chartHeight / 2))
        //     .attr("dy", "1em")
        //     .attr("class", "axisText")
        //     .text(`${yAxisVar}`);
​
    });
});
// Create axes labels
​
​
​
