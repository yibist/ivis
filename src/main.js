import * as d3 from "d3";


const width = 1000;
const height = 600;
const margin = {top: 50, right: 20, bottom: 50, left: 200};


/*const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);*/



// Load CSV file
d3.csv("./src/resources/data/banlist_1.csv").then(data => {
    console.log(data);
});


// Parse CSV into array of objects


//







