// Urscha Fajdiga
// this code is inspired and based on the bost.ocks.org website

// set the height and width for the barchart
var margin = {top: 20, right: 30, bottom: 80, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
	y = d3.scaleLinear().range([height, 0]),
	x = d3.scaleLinear().range([0, width]);

// select the barchart and set height and width
var barchart = d3.select(".barchart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// open de data	
d3.json("dataset.json", function(error, data) {
	data.forEach(function(d) {
        d.country = d.country;
        d.goldmedals = +d.goldmedals;
    });
	
	// scale the range of the data
	x.domain(data.map(function(d) { return d.country; }));
	y.domain([0, d3.max(data, function(d) { return d.goldmedals; })]);
	 
	// scale the range of the data
	var barWidth = width / data.length;
	
	// add data to the barchart
	var bar = barchart.selectAll("g")
		.data(data)
	  .enter().append("g")
		.attr("transform", function(d, i) {return "translate(" + i * barWidth + ",0)"; });
	
	// append the bars
	bar.append("rect")
		.attr("y", function(d) { return y(d.goldmedals); })
		.attr("height", function(d) { return height - y(d.goldmedals); })
		.attr("width", barWidth - 1)
		.attr("fill", "steelblue")
		.on("mouseover", function(d) { d3.select(this).attr("fill", "gold"); })
		.on("mouseout", function(d) { d3.select(this).attr("fill", "steelblue")
		});
	
	// show number of gold medals on hover
	bar.on("mouseover", function() { d3.select(this)
			.append("text")
			.text(function(d) {return d.goldmedals;})
			.attr("id", "number")
			.attr("x", barWidth / 2)
			.attr("y", function(d) { return y(d.goldmedals) -15; })
			.attr("dy", ".75em")
			.style("text-anchor", "middle")})
		.on("mouseout", function() { d3.select(this).select("#number").remove() });
	
	// add countries to x axis
	bar.append("text")
		.attr("id", "countriesaxis")
		.attr("x", 373)
		.attr("y", 352)
		.style("text-anchor", "begin")
		.attr("transform", function(d) { return "rotate(45)" })
		.text(function(d) {return d.country;});
	
	// add the x axis
	barchart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));	
	// text label for the x axis
	barchart.append("text")    
		.attr("transform", 
			"translate(" + (width/2) + " ," + 
                           (height + margin.top + 50) + ")")
		.style("text-anchor", "middle")
		.text("Country");
	
	// add the y axis
	barchart.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y)); 
	// text label for the y axis
	barchart.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "2em")
		.style("text-anchor", "middle")
		.text("Number of gold medals");    
	
});

