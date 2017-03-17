// Synchronous XMLHttpRequest
var my_request = new XMLHttpRequest();
var url = "https://urschaf.github.io/DataProcessing/Homework/week-2/tempdata.html";
var all_data = null;
my_request.open("GET", url, false);
my_request.send();	
all_data = my_request.responseText.split("\n");
	
// split data up into two arrays for temp and date and other variables
var canvasheight = 100;
var millsecondsperday = 86400000
var correction = 16800;
var axismargin = 30;
var temperature = [];
var date = [];
for (var i = 1; i < all_data.length; i++) {
	// save temperatures to array
	var split = all_data[i].split(", ");
	temperature.push(Number(split[1]));
	// save dates to array as milliseconds from 1970
	var d = split[0];
	var e = d.substr(0, 4) + "-" + d.substr(4, 2) + "-" + d.substr(6, 2);
	var actual_date = new Date(e);
	actual_date = actual_date.getTime();
	// transfrom to days 1 - 365
	date_in_milliseconds = actual_date / millsecondsperday - correction;
	date.push(date_in_milliseconds);
}

// function to make data points	
function createTransform(temperature){
	var min = Math.min.apply(null, temperature);
	var max = Math.max.apply(null, temperature);
	var totaal = Math.abs(max) + Math.abs(min)
	// returns the % of the max temp of that day
	return function(x){
		return ((x + Math.abs(min)) / totaal * 100) ;
	}
}

var calculate_point = createTransform(temperature);
	
// draw vanvas
var canvas = document.getElementById("my_canvas");
var ctx = canvas.getContext("2d");
ctx.scale(0.756, 0.9);

ctx.beginPath();
for (i = 0; i < date.length; i++) {
	y_axis_point = (canvasheight - calculate_point(temperature[i]));
	ctx.lineWidth = 1;
	ctx.lineTo(date[i] + axismargin, y_axis_point + axismargin);
	console.log(date[i]);
	console.log(y_axis_point);
	ctx.stroke();
}
ctx.closePath();


// wvariables needed later
var n = 30.5;
var m = 20.84;
var start = 30;
var locationofZeroTemp = 118.5;
var locationof20Temp = 36.6;
var heigthXaxis = 140;

// add text labels to the graph
function addlabels(){
	ctx.font = "10pt Arial";
	/* y axis labels */
	ctx.fillText("Temp in C", 2, 15);
	ctx.fillText(" 20", 5, 40);
	ctx.fillText(" 15", 5, 40 + 1 * m);
	ctx.fillText(" 10", 5, 40 + 2 * m);
	ctx.fillText("  5", 5, 40 + 3 * m);
	ctx.fillText("  0", 5, 40 + 4 * m);
	ctx.fillText(" -5", 5, 40 + 5 * m);
	/* x axis labels */
	ctx.fillText("Month of 2016", 150, 165);
	ctx.fillText("Jan", 1 * n, 153);
	ctx.fillText("Feb", 2 * n, 153);
	ctx.fillText("Mar", 3 * n, 153);
	ctx.fillText("Apr", 4 * n, 153);
	ctx.fillText("May", 5 * n, 153);
	ctx.fillText("Jun", 6 * n, 153);
	ctx.fillText("Jul", 7 * n, 153);
	ctx.fillText("Aug", 8 * n, 153);
	ctx.fillText("Sep", 9 * n, 153);
	ctx.fillText("Oct", 10 * n, 153);
	ctx.fillText("Nov", 11 * n, 153);
	ctx.fillText("Dec", 12 * n, 153);
	}
addlabels();

// function to set a line
function setline(beginy, endy, beginx, endx) {
	ctx.beginPath();
	ctx.moveTo(beginx,beginy);
	ctx.lineTo(endx,endy);
	ctx.stroke();
	ctx.closePath();	
}

// set x and y axis
setline(25, heigthXaxis, start, start);
setline(heigthXaxis, heigthXaxis, start, 400);

// set month ticks
for (var i = 0; i < 12 ; i ++){
	var xpoint = 43 + i * n;
	setline(133, heigthXaxis, xpoint, xpoint);
}

// set dashed temperature lines for zero and 20 degrees
ctx.setLineDash([5, 15]);
setline(locationof20Temp, locationof20Temp, start, 400);
setline(locationofZeroTemp, locationofZeroTemp, start, 400);


