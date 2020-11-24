function getplot(Year) {
    // Load data from HappinessData file
 ​
    d3.csv("./2015 - 2019 Happiness Report Data.csv").then (function(data){
     console.log(data);
 ​
     // //filter data values by year 
     // var filteredData = data.filter(d => d.Year.toString() === Year)[0];
    
     // Create a custom filtering function
     function selectYear(Happy) {
         return Happy.Year == Year;
         }
 ​
    // filter() uses the custom function as its argument
     var filteredData = data.filter(selectYear);
   
     console.log(filteredData);
 ​
     // Sort filterd data by Happiness Score -descending
     var sortedByHappinessScore = filteredData.sort((a,b) => b.Happiness_Score - a.Happiness_Score);
     
     // Slice the first 10 objects for plotting - Top Ten
     slicedData = sortedByHappinessScore.slice(0, 10);
 ​
         // Sort filterd data by Happiness Score -ascending
     var sortedByAscending = filteredData.sort((a,b) => a.Happiness_Score - b.Happiness_Score);
 ​
     // Slice the first 10 objects for plotting - Top Ten for ascending data
     AscendingslicedData = sortedByAscending.slice(0, 10);
         
    // Use the map method with the arrow function to return all the filtered countries.
    var countries = slicedData.map(slice =>  slice.Country);
     
    // Use the map method with the arrow function to return all the filtered countries.
    var countriesAscending = AscendingslicedData.map(slice =>  slice.Country);
 ​
    var ratings = slicedData.map(slice => slice.Happiness_Score);
 ​
    var ratingsAscending = AscendingslicedData.map(slice => slice.Happiness_Score)
 ​
    // Create your trace.
    var trace = {
     x: countries,
     y: ratings,
     type: "bar"
     };
 ​
     // Create the data array for our plot
     var data = [trace];
 ​
     // Define our plot layout
     var layout = {
     title: "Top Happy Countries",
     xaxis: { title: "Countries" },
     yaxis: { title: "HappinessScore"}
     };
 ​
     //  Plot the chart to a div tag with id "bar"
     Plotly.newPlot("bar", data, layout);
 ​
     // Create your trace.
    var trace2 = {
     x: countriesAscending,
     y: ratingsAscending,
     type: "bar"
     };
 ​
     // Create the data array for our plot
     var data2 = [trace2];
 ​
     // Define our plot layout
     var layout2 = {
     title: "Least Happy Countries",
     xaxis: { title: "Countries" },
     yaxis: { title: "HappinessScore"}
     };
 ​
     //  Plot the chart to a div tag with id "bar-plot"
     Plotly.newPlot("bar-plot", data2, layout2);
 ​
    });
 ​
 }
 ​
 function optionChanged(Year) {
     getplot(Year);
     console.log(Year)
 }
 ​
 