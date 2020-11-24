// define dataset
var dataset = "/Data/2015 - 2019 Happiness Report Data.csv"
​
var data;
​
d3.csv(dataset).then((d) => {
    // console.log(d);
    data=d;
​
    // render chart
    bubbleChart()
});
​
// create plot function
function bubbleChart() {
​
    var countries = [];
    var countryHappiness = {};
    var height = 850
    var width = 850
​
    // define svg
    var svg = d3.select("#simpleBubble")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");
​
    // Size scale for happiness
    var size = d3.scaleLinear()
        .domain([0, 1400000000])
        .range([7,55]);  // circle will be between 7 and 55 px wide
​
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
​
    // Three functions that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
    };
​
    var mousemove = function(d) {
        Tooltip
            .html('<u>' + d.key + '</u>' + "<br>" + d.value + " happiness score")
            .style("left", (d3.mouse(this)[0]+20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    };
​
    var mouseleave = function(d) {
        Tooltip
        .style("opacity", 0)
    };
​
    // What happens when a circle is dragged?
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    };
​
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
​
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    };
​
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
            .append("circle")
            .attr("class", "node")
            // .attr("r", value)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            // .style("fill", color)
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
​
    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping
​
    // get unique countries
    data.forEach(function(row) {
        if (!countries.includes(row.Country)) countries.push(row.Country) });
​
    // sum happiness score by country
    for (country of countries) {
        var sum = 0;
        var filterCountry = data.filter(function(row) {return row.Country == country});
        filterCountry.forEach(function(row) {sum = parseFloat(row.Happiness_Score) + sum });
        countryHappiness[country] = sum;
        // console.log(country);
        // console.log(sum)
    };
​
    console.log(countryHappiness)
    
    for(var key in countryHappiness) {
​
        var value = countryHappiness[key]
​
        console.log(value)
        console.log(key)
        
        // Color palette for happiness scores
        var color = ""; 
            if (value > 35) {
                color = "Yellow";
            }
            else if (value > 30) {
                color = "Green";
            }
            else if (value > 25) {
                color = "Blue";
            }
            else if (value > 20) {
                color = "Purple";
            }
            else if (value > 15) {
                color = "Orange";
            }
            else {
                color = "Red";
            }
        console.log(color)
​
        svg.selectAll("circle")
            // .append("circle")
            .attr("r", value)
            .style("fill", color);
        };
        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function(d){ 
                node
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
        });
​
    // end of for loop
    // };
    // confirm data is available as desired
    // console.log(countryHappiness)
// end of bubbleChart function
};
    
    // Abandoned attempt
    // pack = countryHappiness => d3.pack()
    //     .size([width - 2, height - 2])
    //     .padding(3)
    //     (d3.hierarchy({Country: countryHappiness})
    //     .sum(d => d.value))
​
    // const root = pack(countryHappiness);
    
    // const svg = d3.create("svg")
    //     .attr("viewBox", [0, 0, width, height])
    //     .attr("font-size", 10)
    //     .attr("font-family", "sans-serif")
    //     .attr("text-anchor", "middle");
​
    // const leaf = svg.selectAll("g")
    //     .data(root.leaves())
    //     .join("g")
    //     .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
​
    // leaf.append("circle")
    //     .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
    //     .attr("r", d => d.r)
    //     .attr("fill-opacity", 0.7)
    //     .attr("fill", d => color(d.data.group));
​
    // leaf.append("clipPath")
    //     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    //     .append("use")
    //     .attr("xlink:href", d => d.leafUid.href);
​
    // leaf.append("text")
    //     .attr("clip-path", d => d.clipUid)
    //     .selectAll("tspan")
    //     .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    //     .join("tspan")
    //     .attr("x", 0)
    //     .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    //     .text(d => d);
​
    // leaf.append("title")
    //     .text(d => `${d.data.title === undefined ? "" : `${d.data.title}`}${format(d.value)}`);
    
    // return svg.node();
// };
