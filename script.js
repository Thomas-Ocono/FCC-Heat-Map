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
    .scaleLinear()
    .domain([1, 12])
    .range([height - padding, padding]);

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
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  let yAxis = d3.axisLeft(yScale).tickFormat((d) => {
    switch (d) {
      case 1:
        return "December";
      case 2:
        return "November";
      case 3:
        return "October";
      case 4:
        return "September";
      case 5:
        return "August";
      case 6:
        return "July";
      case 7:
        return "June";
      case 8:
        return "May";
      case 9:
        return "April";
      case 10:
        return "March";
      case 11:
        return "February";
      case 12:
        return "January";
    }
  });
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
  svg
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("width", (d, i) => (width - padding) / yearsArray.length)
    .attr("height", (d, i) => (height - padding) / 12)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month) - padding / 2);
};

//get data from url then run main function
req.open("GET", url, true);
req.onload = () => {
  let data = JSON.parse(req.responseText);
  main(data);
};
req.send();
