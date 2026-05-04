const margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const singleCardSvg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const fullTimeLineSvg = d3.select("#fullTimeLineSvg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


d3.csv("src/resources/data/banlist_1.csv").then(function (data) {

    const parseDate = d3.timeParse("%Y-%m");

    const cards = data.map(card => ({
        name: card["Card Name"],
        values: Object.keys(card)
            .filter(k => k !== "Card Name")
            .map(k => ({
                date: parseDate(k),
                value: +card[k]
            }))
    }));

    const cardNames = cards.map(d => d.name);
    // Dropdown
    d3.select("#cardSelect")
        .selectAll("option")
        .data(cardNames)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));


    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    const xAxis = singleCardSvg.append("g")
        .attr("transform", `translate(0,${height})`);
    const yAxis = singleCardSvg.append("g")
        .call(d3.axisLeft(y));
    const linePath = singleCardSvg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2);
    function update(selectedCard) {

        const card = cards.find(d => d.name === selectedCard);
        if (!card) return;

        x.domain(d3.extent(card.values, d => d.date));

        xAxis.call(d3.axisBottom(x));

        linePath
            .datum(card.values)
            .transition()
            .duration(500)
            .attr("d", line);
    }

    // Init
    update(cardNames[0]);

    // Interaction
    d3.select("#cardSelect")
        .on("change", function () {
            update(this.value);
        });



    const xFull = d3.scaleTime().range([0, width]);
    const yFull = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    const xAxisFull = fullTimeLineSvg.append("g")
        .attr("transform", `translate(0,${height})`);
    const yAxisFull = fullTimeLineSvg.append("g")
    const linePathFull = fullTimeLineSvg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2);

    function drawFullTimeLineSVG(data) {

        xFull.domain(d3.extent(data, d => d.date));
        yFull.domain([0, d3.max(data, d => d.value)]);

        xAxisFull.call(d3.axisBottom(xFull));
        yAxisFull.call(d3.axisLeft(yFull));

        linePathFull
            .datum(data)
            .attr("d", d3.line()
                .x(d => xFull(d.date))
                .y(d => yFull(d.value))
            );
    }
    drawFullTimeLineSVG();


});