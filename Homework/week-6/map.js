// Urscha Fajdiga 11377437
// This file creates the datamap and the scatterplot on the map.html page

window.onload = function() {
	
	// queue both csv files
	d3.queue()
		.defer(d3.csv, 'gdppercountry.csv')
		.defer(d3.csv, 'happinessindex.csv')
		.await(make_maps);
	
	function make_maps(error, gdppercountry, happinessindex) {
		// first checking for error and then making both visualisations
		if (error) throw error;
		make_chloropleth();
		make_scatterplot(gdppercountry, happinessindex);
	}
	
	// the function that makes the chloropleth
	function make_chloropleth(){
		
		var chloropleth = new Datamap({
			element: document.getElementById('container'),
			projection: 'mercator',
			fills: {
				GDP0_5: '#fee5d9',
				GDP5_20: '#fcae91',
				GDP20_30: '#fb6a4a',
				GDP30_40: '#de2d26',
				GDP40_X: '#a50f15',
				defaultFill: '#aaaaaa'
			},
			dataUrl: 'gdppercountry.csv',
			dataType: 'csv',
			data: {},
			geographyConfig: {
					highlightOnHover: true,
					highlightFillColor: '#5e2b2b',
					popupTemplate: function(geo, data) {
						return ['<div class="hoverinfo"><strong>',
								geo.properties.name + ': $' + data.GDP + ' per capita',
								'</strong></div>'].join('');
					}
				}
		});	
		
		// draw the legend
		chloropleth.legend({
			legendTitle: "GDP per capita in USD",
			defaultFillName: "No data",
			labels: {
				GDP0_5: "0-5000 USD",
				GDP5_20: "5000-20.000 USD",
				GDP20_30: "20.000-30.000 USD",
				GDP30_40: "30.000-40.000 USD",
				GDP40_X: "above 40.000 USD"
			}
		});
		
		// this function makes the dots red in the scatterplot and the old dot black
		var old_id;
		chloropleth.svg.selectAll("path.datamaps-subunit").on("click", function(data) {
			if (old_id == undefined){
				d3.select("#" + data.id).style("fill", "red").attr("r", 8);
				old_id = data.id;
			}
			else {
				d3.select("#" + data.id).style("fill", "red").attr("r", 8);
				d3.select("#" + old_id).style("fill", "black").attr("r", 5);
				old_id = data.id;
			}
		});
	};
	
	// initial x-axis and add slider to the page
	var x_range_max = 100000;
	var x_range_min = 0;
	var slider = new Slider("#slider", {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
	
	// eventlistener for when the slider updates and draw new scatterplot
	slider.on("slideStop", update_scattterplot);
	function update_scattterplot(){
		d3.select(".scatterplot_g").remove();
		values = slider.getValue();
		x_range_min = values[0];
		x_range_max = values[1];
		make_scatterplot();
	};
	
	// this function makes the scatterplot
	function make_scatterplot(happinessindex){
		
		// set margins and size of the scatterplot
		var margin = {top: 20, right: 30, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 350 - margin.top - margin.bottom;
		
		// setup x and y
		var x = d3.scale.linear().range([0, width]),
			y = d3.scale.linear().range([height, 0]);
		var x_axis = d3.svg.axis().scale(x).orient("bottom"),
			y_axis = d3.svg.axis().scale(y).orient("left");
				
		// add scatterplot
		var scatterplot = d3.select("#scatterplot")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + + margin.top + margin.bottom)
		  .append("g")
			.attr("class", "scatterplot_g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// add the tooltip
		var tooltip = d3.select("#scatterplotcontainer").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);	
				
		// load data
		d3.csv("happinessindex.csv", function(error, data) {
			if (error) throw error;
			// change string (from CSV) into number format
			data.forEach(function(d) {
				d.GDP = +d.GDP;
				d.Happiness = +d.Happiness;
			});
			
			x.domain([x_range_min, x_range_max]);
			y.domain([0, 10]);
			
			// x-axis
			scatterplot.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(x_axis)
			.append("text")
			  .attr("class", "label")
			  .attr("x", width)
			  .attr("y", -6)
			  .style("text-anchor", "end")
			  .text("GDP per capita");

			// y-axis
			scatterplot.append("g")
			  .attr("class", "y axis")
			  .call(y_axis)
			.append("text")
			  .attr("class", "label")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Happiness index");
			
			// draw dots with tooltip
			scatterplot.selectAll(".dot")
			  .data(data)
			.enter().append("circle")
			  .attr("id", function(d) { return d.id;})
			  .attr("r", 5)
			  .attr("cx", function(d) { return x(d.GDP); })
			  .attr("cy", function(d) { return y(d.Happiness); })
			  .style("fill", "black")
			  .on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip.html(d.Entity + "<br/>Happiness: " + d.Happiness 
					+ "<br/>GDP: " + d.GDP + " billion")
					.style("margin-left", (d3.event.pageX + 5) + "px")
					.style("margin-bottom", 0 );
			  })
			  .on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			});
			
		});
	};
		
};
