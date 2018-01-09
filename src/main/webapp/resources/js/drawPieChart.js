/**
 * Created by Bean on 19-Dec-17.
 */

var drawPieChart = function(data) {
    var pageX = 0;
        w = 650,                        //width
        h = 800,                            //height
        r = 160,                            //radius
        color = d3.scale.category20c();     //builtin range of colors

    var tots = d3.sum(data, function(d){
        return d.value;
    })

    data.forEach(function(d){
        d.percentage = d.value / tots;
    })

    var vis = d3.select(".topWord")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
        .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
        .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + 160 + "," + 200 + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc)
        .on("mouseover", function(d, i) {
            console.log("hover");
            pageX = d3.event.pageX;
            $("#tooltip")
                .css('left', pageX + "px")
                .css('top', d3.event.pageY - 20 +"px")
                .html(data[i].label + " " + (data[i].percentage*100).toFixed(2) +"%")
                .show();
        })
        .on('mouseout', function(d) {
            $("#tooltip").html('').hide();
        });

    arcs.append("svg:text")
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });        //get the label from our original data array

    vis.selectAll(".percent")
        .on("click", function(d) {
            alert('test');
            // code you want executed on the click event
        });
}

