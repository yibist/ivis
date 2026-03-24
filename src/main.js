// main.js
import * as d3 from "d3";
import fs from "fs";

// Read CSV file from disk
const csvFile = "./resources/data/banlist.csv";
const csvData = fs.readFileSync(csvFile, "utf-8");

// Parse CSV into array of objects
const data = d3.csvParse(csvData, d => ({
    CardName: d.CardName,
}));

console.log(data);