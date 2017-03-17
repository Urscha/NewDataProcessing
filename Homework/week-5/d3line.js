// Urscha Fajdiga 11377437
// This file creates a multiple data view of temperature

window.onload = function() {
	
	// set the height and width for the barchart
	var margin = {top: 20, right: 30, bottom: 80, left: 50},
		width = 1000 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom,
		y = d3.scaleLinear().range([height, 0]),
		x = d3.scaleTime().range([0, width]);

	// select the barchart and set height and width
	var svg = d3.select(".linechart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// variables for the three different lines
	var gem_line = d3.line()
		.x(function(d) { return x(d.Datum); })
		.y(function(d) { return y(d.Gem); });
	var min_line = d3.line()
		.x(function(d) { return x(d.Datum); })
		.y(function(d) { return y(d.Min); });
	var max_line = d3.line()
		.x(function(d) { return x(d.Datum); })
		.y(function(d) { return y(d.Max); });
	
	// define focus variable, bisect data and format date for later use
	var focus = svg.append("g")
		.style("display", "none");
	var bisectDate = d3.bisector(function(d) { return d.Datum; }).left;
	var formatDate = d3.timeFormat("%d-%b");
		
	// make the linegraph with maastricht
	d3.json("tempmaastricht.json", function(error, data) {
		data.forEach(function(d) {
			d.Datum = Date.parse(d.Datum);
			d.Gem = +d.Gem;
			d.Max = +d.Max;
			d.Min = +d.Min;
		});

		x.domain(d3.extent(data, function(d) { return d.Datum; }));
		y.domain(d3.extent(data, function(d) { return d.Max; }));
				
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickFormat(d3.timeFormat("1 %B"))
		
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
		svg.append("g")
			.call(d3.axisLeft(y))
			.append("text")
			  .attr("fill", "#000")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", "0.71em")
			  .attr("text-anchor", "end")
			  .text("Temperature in 0,1 degrees Celcius");
		
		// Add the lines path.
		svg.append("path")
			.attr("class", "line_maastricht_gem")
			.attr("d", gem_line(data))
			.attr("fill", "none")
			.attr("stroke", "#bd0026")
			.attr("display", "block")
			.attr("stroke-width", 1);	
		svg.append("path")
			.attr("class", "line_maastricht_min")
			.attr("d", min_line(data))
			.attr("fill", "none")
			.attr("stroke", "#fecc5c")
			.attr("stroke-width", 1);
		svg.append("path")
			.attr("class", "line_maastricht_max")
			.attr("d", max_line(data))
			.attr("fill", "none")
			.attr("stroke", "#fd8d3c")
			.attr("stroke-width", 1);
		
		// append circle at the intersection
		focus.append("circle")
			.attr("class", "y")
			.attr("r", 4)
			.style("stroke", "black")
			
		// place the value at the intersection
		focus.append("text")
			.attr("class", "y1")
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "-.3em");
		
		// append the rect that listens to mousemovements
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);  
		
		function mousemove() {                                 
			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],                              
				d1 = data[i],                                  
				d = x0 - d0.Datum > d1.Datum - x0 ? d1 : d0;
			
			// move the circle and text to the appropriate location
			focus.select("circle.y")                          
				.attr("transform",                           
                  "translate(" + x(d.Datum) + "," +         
                                 y(d.Gem) + ")");	
			focus.select("text.y1")
				.attr("transform",
					"translate(" + x(d.Datum) + "," +
								   y(d.Gem) + ")")
				.text(formatDate(d.Datum) + " Maastricht avg. temp: " + d.Gem);
		};
	});
	
	// make the linegraph with maastricht
	d3.json("tempwijkaanzee.json", function(error, data) {
		data.forEach(function(d) {
			d.Datum = Date.parse(d.Datum);
			d.Gem = +d.Gem;
			d.Max = +d.Max;
			d.Min = +d.Min;
		});
		// Add the lines path.
		svg.append("path")
			.attr("class", "line_waz_gem")
			.attr("d", gem_line(data))
			.attr("fill", "none")
			.attr("stroke", "#045a8d")
			.attr("stroke-width", 1);	
		svg.append("path")
			.attr("class", "line_waz_min")
			.attr("d", min_line(data))
			.attr("fill", "none")
			.attr("stroke", "#bdc9e1")
			.attr("stroke-width", 1);
		svg.append("path")
			.attr("class", "line_waz_max")
			.attr("d", max_line(data))
			.attr("fill", "none")
			.attr("stroke", "#74a9cf")
			.attr("stroke-width", 1);

	});
	
	// toggles the lines on and off when checkbox is clicked
	d3.selectAll("input").on('click', function() {
		var path_name = this.value;
		if(this.checked) {
			d3.select("." + path_name)
				.attr("display", "block")
		} else {
			d3.select("." + path_name)
				.attr("display", "none");
		}
	});
}

