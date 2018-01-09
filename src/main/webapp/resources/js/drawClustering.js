/**
 * Created by Bean on 12-Dec-17.
 */


var duplicate = function (arr, term) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == term) return i;
        }
        return -1;
    }


var initialNodes;

var getNodes = function (nodes){
    initialNodes = (jQuery.extend(true, [], nodes));
}

var width = 950,
    height = 490;

var clustering = function (data) {
    $("#vis").empty();

    function nodeByName(name, group, color, title) {
        var index = duplicate(nodes, name);
        if (index == -1 && name != undefined) {
            nodes.push({name: name, group: group, color: color, title: title});
            return (duplicate(nodes, name));
        }
        return index;
    }

    // console.log(data);
    // var links = [
    //     {"source": 135249, "target": 135247, "value": 1}];

    var links = data;
    var nodes = [];

    // Create nodes for each unique source and target.
    links.forEach(function (link) {
        link.source = nodeByName(link.source, link.value, link.colorS, link.titleS);
        link.target = nodeByName(link.target, link.value, link.colorT, link.titleT);
    });

    var graph = {nodes: nodes, edges: links};

    initialNodes = [];
    getNodes(nodes);

    // Extract the nodes and links from the data.
    var nodes = graph.nodes,
        links = graph.links;

    var svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height);

    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + 0 + ", " + 40 + ")");


    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.edges)
        .size([width, height])
        // .gravity(0.05)
        .linkDistance(100)
        .charge(-50)
        .start();

    var edges = plot.selectAll('line')
        .data(graph.edges)
        .enter()
        .append('line')
        .style('stroke', '#424242')
        .style('stroke-width', 1);

    var colors = d3.scale.category20();

    var color = ["#013ADF", "#BD6B09", "#B40404", "#FF0040", "#00FF00", "#8000FF"];
    var nodes = plot
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', function (d) {
            return d.color;
        })
        .on("dblclick", dblclick)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(force.drag);

    var text = plot.append("svg:g").selectAll("g")
        .data(force.nodes())
        .enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    text.append("plot:text")
        .attr("x", 12)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function (d) {
            return d.name;
        });

    text.append("plot:text")
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

    function mouseover(d) {
        var g = d3.select(this); // The node
        // The class is used to remove the additional text later
        var info = g.append('text')
            .classed('info', true)
            .attr('x', 20)
            .attr('y', 10)
            .text('More info');
    }
    function mouseout() {
        d3.select(this).select('text.info').remove();
    }

    var top20Keywords = findTopKeywordsOfCluster(initialNodes);

    $("#title-detailTable").empty();
    $("#title-detailTable").append('<h4> Color of node denotes each topic. </h4>')
    $("#title-detailTable").append('<h4> <font color="#00EE00">Green</font> : "KhoaHoc"' + '</br> <font color="#FFFF33">Yellow</font> : "TheGioi" </br> <font color="#990099">Purple</font> : "CongNghe"' +
        '</br> <font color="#FF33CC">Pink</font> : "GiaoDuc" </br> <font color="#0066FF">Blue</font> : "ThoiSu" </br> <font color="#CC0000">Red</font> : "PhapLuat"</h4>' +
        '<h4>Please double click on any nodes in cluster to discover top 20 keywords of cluster.</h4>');
}


var drawBar = function(arr) {
    var textCloud = {};
    $("#clusteringModal").empty();
    for (var i = 0; i < arr.length; i++) {
        var row = arr[i];
            console.log(row.term + ":" + row.frequency);
            textCloud[row.term] = row.frequency;
    }
    drawWordCloud(textCloud);
    $("#vis").remove('h4');
    $("#clusterModal").modal("show");
}

