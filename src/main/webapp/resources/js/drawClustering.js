/**
 * Created by Bean on 12-Dec-17.
 */


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

    // console.log(data);
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

    var top20Keywords = findTopKeywordsOfCluster(nodes);

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
        .on("dblclick", dblclick)
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

    function dblclick(d) {
        drawBar(top20Keywords[d.group]);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }

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

var drawBar = function(arr) {
    var textCloud = {};
    $("#clusteringModal").empty();
    for (var i = 0; i < arr.length; i++) {
        var row = arr[i];
            console.log(row.term + ":" + row.frequency);
            textCloud[row.term] = row.frequency;
    }
    // drawWordCloud("Of course that’s your contention. You’re a first year grad student. You just got finished readin’ some Marxian historian, Pete Garrison probably. You’re gonna be convinced of that ’til next month when you get to James Lemon and then you’re gonna be talkin’ about how the economies of Virginia and Pennsylvania were entrepreneurial and capitalist way back in 1740. That’s gonna last until next year. You’re gonna be in here regurgitating Gordon Wood, talkin’ about, you know, the Pre-Revolutionary utopia and the capital-forming effects of military mobilization… ‘Wood drastically underestimates the impact of social distinctions predicated upon wealth, especially inherited wealth.’ You got that from Vickers, Work in Essex County, page 98, right? Yeah, I read that, too. Were you gonna plagiarize the whole thing for us? Do you have any thoughts of your own on this matter? Or do you, is that your thing? You come into a bar. You read some obscure passage and then pretend, you pawn it off as your own, as your own idea just to impress some girls and embarrass my friend? See, the sad thing about a guy like you is in 50 years, you’re gonna start doin’ some thinkin’ on your own and you’re gonna come up with the fact that there are two certainties in life. One: don’t do that. And two: you dropped a hundred and fifty grand on a fuckin’ education you coulda got for a dollar fifty in late charges at the public library.");
    drawWordCloud(textCloud);
    $("#clusterModal").modal("show");
}

