const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const req = new XMLHttpRequest();

const main = (data) => {
  const baseTemp = data.baseTemperature;
  const monthlyVariance = data.monthlyVariance;

  //make an array of years from the data, removing duplicates
  let yearsArray = [];
  monthlyVariance.forEach((element) => {
    if (!yearsArray.includes(element.year)) {
      yearsArray.push(element.year);
    }
  });

  const height = 700;
  const width = 1800;
  const padding = 100;

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(yearsArray), d3.max(yearsArray)])
    .range([padding, width - padding]);

  let yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("border", "5px solid black")
    .style("border-radius", "5px")
    .style("display", "block")
    .style("margin", "auto");

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ")");

  svg
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("width", (width - padding) / yearsArray.length)
    .attr("height", (height - 2 * padding) / 12)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .attr("fill", (d) => {
      if (d.variance <= -1) {
        return "SteelBlue";
      }
      if (d.variance <= 0) {
        return "LightSteelBlue";
      }
      if (d.variance <= 1) {
        return "orange";
      } else {
        return "crimson";
      }
    });
};

//get data from url then run main function
req.open("GET", url, true);
req.onload = () => {
  let data = JSON.parse(req.responseText);
  main(data);
};
req.send();
