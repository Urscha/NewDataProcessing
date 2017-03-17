// Urscha Fajdiga 11377437
// This file creates the datamap on the map.html page

window.onload = function() {
	var chloropleth = new Datamap({
	element: document.getElementById('container'),
	projection: 'mercator',
	fills: {
		GDP0_200: '#fee5d9',
		GDP201_400: '#fcae91',
		GDP401_600: '#fb6a4a',
		GDP601_800: '#de2d26',
		GDP801_1000: '#a50f15',
		defaultFill: '#aaaaaa'
	},
	dataUrl: 'output.csv',
	dataType: 'csv',
	data: {},
	geographyConfig: {
			highlightOnHover: true,
			highlightFillColor: '#5e2b2b',
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        geo.properties.name + ': $' + data.GDP,
                        '</strong></div>'].join('');
            }
        }
	
	});	
	
	chloropleth.legend({
		legendTitle: "GDP in USD",
		defaultFillName: "No data",
		labels: {
			GDP0_200: "0-200.000 billion",
			GDP201_400: "200.000-400.000 billion",
			GDP401_600: "400.000-600.000 billion",
			GDP601_800: "600.000-800.000 billion",
			GDP801_1000: "above 800.000 billion"
		}
	});
}



