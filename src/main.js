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
        .call(d3.axisLeft(y).tickValues([-1, 0, 1, 2, 3]));

    singleCardSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 12)
        .attr("text-anchor", "middle")
        .text("Ban Status");

    const gradient = singleCardSvg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

    gradient.selectAll("stop")
        .data([
            { offset: "0%", color: "blue" },
            { offset: "100%", color: "red" }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    const linePath = singleCardSvg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", 3);

    function update(selectedCard) {
        const card = cards.find(d => d.name === selectedCard);
        if (!card) return;

        x.domain(d3.extent(card.values, d => d.date));
        xAxis.call(d3.axisBottom(x));

        const min = d3.min(card.values, d => d.value);
        const max = d3.max(card.values, d => d.value);

        gradient
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", y(min))
            .attr("y2", y(max));

        linePath
            .datum(card.values)
            .transition()
            .duration(500)
            .attr("d", line);
    }

    update(cardNames[0]);

    d3.select("#cardSelect")
        .on("change", function () {
            update(this.value);
        });



    const xFull = d3.scaleTime().range([0, width]);
    const yFull = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    const xAxisFull = fullTimeLineSvg.append("g")
        .attr("transform", `translate(0,${height})`);
    const yAxisFull = fullTimeLineSvg.append("g")
        .call(d3.axisLeft(yFull).tickValues([-1, 0, 1, 2, 3]));

    fullTimeLineSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 12)
        .attr("text-anchor", "middle")
        .text("Total Ban Value");

    const linePathFull = fullTimeLineSvg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2);

    function drawFullTimeLineSVG() {
        const yearlySums = {};

        data.forEach(card => {
            Object.keys(card)
                .filter(k => k !== "Card Name")
                .forEach(k => {
                    const value = +card[k];
                    if (value === -1) return;

                    const date = parseDate(k);
                    const year = date.getFullYear();

                    yearlySums[year] = (yearlySums[year] || 0) + value;
                });
        });

        const result = Object.entries(yearlySums).map(([year, total]) => ({
            year: +year,
            total
        }));

        xFull.domain(d3.extent(result, d => new Date(d.year, 0, 1)));
        yFull.domain([0, d3.max(result, d => d.total)]);

        yAxisFull.call(d3.axisLeft(yFull));

        xAxisFull.call(d3.axisBottom(xFull));

        linePathFull
            .datum(result)
            .attr("d", d3.line()
                .x(d => xFull(new Date(d.year, 0, 1)))
                .y(d => yFull(d.total))
            );
    }
    drawFullTimeLineSVG();
});