
var f, p, s;

var aspect = 960 / 500,
    chart = $("#chart");

$(window).on("resize", function() {
    var targetWidth = chart.parent().width();
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
});

d3.json("transit-routes.topojson", function(error, routes) {

	// TODO: since topoJSON doesn't save any space for our multi-line transit file, and since 
	// we're apparently losing things like the route IDs, let's just switch back to using GeoJSON.

	// XXX TODO BUG - make responsive:
	// http://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive
	var width = 960;
	var height = 500;

 	console.log(routes);

	var subunits = f = topojson.feature(routes, routes.objects.collection);

 	// we want to center and translate according to the path object we've loaded. 
 	// Some of this code is from Mike Bostock on stackoverflow:
 	// http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
 	// and see https://groups.google.com/forum/#!topic/d3-js/lR7GGswygI8

 	// Create a unit projection.
	var projection = p = d3.geo.albers()
	    .scale(1)
	    .translate([0, 0])
	    .rotate([112,0,0]);
	    // .rotate([0,0,0]); // for info on rotations: http://bl.ocks.org/mbostock/4282586

	// Create a path generator.
	var path = d3.geo.path()
	    .projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	var b = path.bounds(subunits),
	    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
	    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

	// Update the projection to use computed scale & translate.
	projection
	    .scale(s)
	    .translate(t);
	    // .rotate([96,0,-2]);

	// console.log(path);

	var svg = d3.select("#chart");
	svg.append("path")
	    .datum(subunits)
	    .attr("d", path)
	    .attr("stroke", "#666")
	    .attr("stroke-width", "2");

    svg.selectAll(".subunit")
    .data(topojson.feature(routes, routes.objects.collection).features)
	  .enter().append("path")
	    .attr("class", function(d) { return "subunit " + d.id; })
	    .attr("d", path);


	    // TODO: make one of the routes blue.

});
