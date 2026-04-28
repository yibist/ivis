const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("src/resources/data/banlist_1.csv").then(function(data) {

    // -----------------------
    // Dropdown
    // -----------------------
    const cardNames = data.map(d => d["Card Name"]);

    d3.select("#cardSelect")
        .selectAll("option")
        .data(cardNames)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // -----------------------
    // Scales
    // -----------------------
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);

    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g").call(d3.axisLeft(y));

    // Line path (empty at start)
    const linePath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2);

    const parseDate = d3.timeParse("%Y-%m");

    // -----------------------
    // Update function
    // -----------------------
    function update(selectedCard) {

        const card = data.find(d => d["Card Name"] === selectedCard);

        const values = Object.keys(card)
            .filter(k => k !== "Card Name")
            .map(k => ({
                date: parseDate(k),
                value: +card[k]
            }));

        // Update scales
        x.domain(d3.extent(values, d => d.date));
        xAxis.call(d3.axisBottom(x));

        // Update line
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        linePath
            .datum(values)
            .transition()
            .duration(500)
            .attr("d", line);
    }

    // -----------------------
    // Initial draw
    // -----------------------
    update(cardNames[0]);

    // -----------------------
    // Event listener
    // -----------------------
    d3.select("#cardSelect").on("change", function() {
        const selected = d3.select(this).property("value");
        update(selected);
    });

});












