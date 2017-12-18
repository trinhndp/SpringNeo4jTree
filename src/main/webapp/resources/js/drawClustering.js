/**
 * Created by Bean on 12-Dec-17.
 */


    // var svg = d3.select("#svgClustering");
// var svg = d3.select("#vis").append("svg")
//         .attr("width", width)
    // .attr("height", height);

var duplicate = function (arr, term) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == term) return i;
        }
        return -1;
    }



var clustering = function (data) {

    function nodeByName(name, group) {
        var index = duplicate(nodes, name);
        if (index == -1 && name != undefined) {
            nodes.push({name: name, group: group});
            return (duplicate(nodes, name));
        }
        return index;
    }

    console.log(data);
    // var links = [
    //     {"source": 135249, "target": 135247, "value": 1}];
    var width = 950,
        height = 550;
    var links = data;
    var nodes = [];

    // Create nodes for each unique source and target.
    links.forEach(function (link) {
        link.source = nodeByName(link.source, link.value);
        link.target = nodeByName(link.target, link.value);
    });

    var graph = {nodes: nodes, edges: links};

    // Extract the nodes and links from the data.
    var nodes = graph.nodes,
        links = graph.links;

    var svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.edges)
        .size([width, height])
        .linkDistance(100)
        .charge(-100)
        .start();

    var edges = svg.selectAll('line')
        .data(graph.edges)
        .enter()
        .append('line')
        .style('stroke', '#424242')
        .style('stroke-width', 1);

    var colors = d3.scale.category20();

    var color = ["#013ADF", "#BD6B09", "#B40404", "#FF0040", "#00FF00", "#8000FF"];
    var nodes = svg
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', function (d) {
            return color[d.group];
        })
        .call(force.drag);

    var text = svg.append("svg:g").selectAll("g")
        .data(force.nodes())
        .enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 12)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function (d) {
            return d.name;
        });

    text.append("svg:text")
        .attr("x", 12)
        .attr("y", ".31em")
        .text(function (d) {
            return d.name;
        });

    force.on('tick', function () {
        edges.attr({
            x1: function (d) {
                return d.source.x;
            },
            y1: function (d) {
                return d.source.y;
            },
            x2: function (d) {
                return d.target.x;
            },
            y2: function (d) {
                return d.target.y;
            }
        });

        nodes.attr('cx', function (d) {
            return d.x;
        })
            .attr('cy', function (d) {
                return d.y;
            });

        text.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
}
//
// var clustering = function (data) {
//     //data =     [{"name": "18956", "group": "3"}];
//     var width = 950,
//         height = 550;
//     var links = [
//         {"source": 135249, "target": 135247, "value":1},
//         {"source": 135247, "target": 135256, "value":1},
//         {"source": 135256, "target": 135258, "value":1},
//         {"source": 135258, "target": 135249, "value":1},
//         {"source": 135249, "target": 135256, "value":1},
//         {"source": 135258, "target": 135247, "value":2},
//         {"source": 135217, "target": 135228, "value":2}
//     ];
//
//     var nodes = {};
//     links.forEach(function(link){
//         links.source = nodes[link.source] || (nodes[link.source] = {name: link.source, group: link.value});
//         links.target = nodes[link.target] || (nodes[link.target] = {name: link.target, group: link.value});
//     });
//
//     var graph = {nodes : nodes, links : links};
//     //     // var svg = d3.select("#svgClustering");
//     var svg = d3.select("#vis").append("svg")
//         .attr("width", width +"px")
//         .attr("height", height+"px");
//
//     // init force layout
//     var force = d3.layout.force()
//         .size([width, height])
//         .nodes(d3.values(nodes)) // initialize with a single node
//         // .links(links)
//         // .linkDistance(50)
//         .charge(-200)
//         .on("tick", tick)
//         .start();
//
//     var circle = svg.append("svg:g").selectAll("circle")
//         .data(force.nodes())
//         .enter().append("svg:circle")
//         .attr("r", 8)
//         .call(force.drag);
//
//     var text = svg.append("svg:g").selectAll("g")
//         .data(force.nodes())
//         .enter().append("svg:g");
//     //
//     // var link = svg.append("svg:g").selectAll(".link")
//     //     .data(links)
//     //     .enter().append("line")
//     //     .attr('class', 'link');
//     //
//     // A copy of the text with a thick white stroke for legibility.
//     text.append("svg:text")
//         .attr("x", 12)
//         .attr("y", ".31em")
//         .attr("class", "shadow")
//         .text(function(d) { return d.name; });
//
//     text.append("svg:text")
//         .attr("x", 12)
//         .attr("y", ".31em")
//         .text(function(d) { return d.name; });
//
//     function tick(e) {
//         circle.attr("transform", function(d) {
//             return "translate(" + d.x + "," + d.y + ")";
//         });
//
//         text.attr("transform", function(d) {
//             return "translate(" + d.x + "," + d.y + ")";
//         });
//
//         link.attr("d", function(d) {
//             var dx = d.target.x - d.source.x,
//                 dy = d.target.y - d.source.y,
//                 dr = Math.sqrt(dx * dx + dy * dy);
//             return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
//         });
//     }
// }

