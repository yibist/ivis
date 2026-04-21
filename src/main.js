// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Load CSV file
d3.csv("src/resources/data/banlist_1.csv").then(function(data) {

    // pick one card
    const card = data.find(d => d["Card Name"] === "A Hero Lives");

    // convert row → array of {date, value}
    const values = Object.keys(card)
        .filter(k => k !== "Card Name")
        .map(k => ({
            date: d3.timeParse("%Y-%m")(k),
            value: +card[k]
        }));

    // x scale (time instead of linear)
    const x = d3.scaleTime()
        .domain(d3.extent(values, d => d.date))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // y scale (ban status)
    var y = d3.scaleLinear()
        .domain([-1, 3])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // line generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    svg.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2)
        .attr("d", line);

});








