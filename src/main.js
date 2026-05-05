const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//d3.select("#Titlebody")

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

    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`);

    const yAxis = svg.append("g")
        .call(d3.axisLeft(y).tickValues([-1, 0, 1, 2, 3]));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 12)
        .attr("text-anchor", "middle")
        .text("Ban Status");

    // Set the gradient
    const gradient = svg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

    gradient.selectAll("stop")
        .data([
            {offset: "0%", color: "blue"},
            {offset: "100%", color: "red"}
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);


    // Line path (empty at start)
    const linePath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", 3);

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


        //get min and max values for the color gradient
        const min = d3.min(values, d => d.value);
        const max = d3.max(values, d => d.value);

        gradient
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", y(min))
            .attr("y2", y(max));

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












