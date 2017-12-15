/**
 * Created by Bean on 12-Dec-17.
 */

var clustering = function (data) {
    //data =     [{"name": "18956", "rating": "0.1969418493", "group": "3"}];
    var width = 950,
        height = 550,
        padding = 1.5, // separation between same-color nodes
        clusterPadding = 16, // separation between different-color nodes
        maxRadius = 24;

    var n = 100, // total number of nodes
        m = 20; // number of distinct clusters

    var color = d3.scale.category10()
        .domain(d3.range(m));

// The largest node for each cluster.
    var clusters = new Array(m);
    var nodes = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        for (var key in obj) {
            var n = obj['name']; // name
            var div = obj['group']; // division
            d = {
                cluster: div,
                radius: 0.25*100,
                name: n,
                division: div
            };
        }
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        nodes.push(d);
    }

    // Use the pack layout to initialize node positions.
    d3.layout.pack()
        .sort(null)
        .size([width, height])
        .children(function (d) {
            return d.values;
        })
        .value(function (d) {
            return d.radius * d.radius;
        })
        .nodes({
            values: d3.nest()
                .key(function (d) {
                    return d.cluster;
                })
                .entries(nodes)
        });

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.03)
        .charge(0)
        .on("tick", tick)
        .start();

    // var svg = d3.select("#svgClustering");
    var svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height);

    // console.log(nodes)

    var node = svg.selectAll("g")
        .data(nodes)
        .enter().append("g").call(force.drag);

    var circles = node.append("circle")
        .style("fill", function (d) {
            return color(d.cluster);
        })


    //add text to the group
    node.append("text")
        .text(function (d) {
            return d.name;
        })
        .attr("dx", -20)
        .text(function (d) {
            return d.name
        })
        .style("stroke", "white");


    node.selectAll("circle").transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 5;
        })
        .attrTween("r", function (d) {
            var i = d3.interpolate(0, d.radius);
            return function (t) {
                return d.radius = i(t);
            };
        });

    svg.selectAll("g.node").on("click", function(id) { var _node = g.node(id); console.log("Clicked " + id,_node); });

    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            .attr("transform", function (d) {
                var k = "translate(" + d.x + "," + d.y + ")";
                return k;
            })
    }


    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {

            var cluster = clusters[d.index];

            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }
    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}

var testCluster = function () {

    var width = 556,
        height = 500;

    var fill = d3.scale.category10(),
        nodes = d3.range(100).map(Object);

    var groups = d3.nest().key(function (d) {
        return d & 3;
    }).entries(nodes);

    var groupPath = function (d) {
        return "M" +
            d3.geom.hull(d.values.map(function (i) {
                return [i.x, i.y];
            }))
                .join("L")
            + "Z";
    };

    var groupFill = function (d, i) {
        return fill(i & 3);
    };

    var vis = d3.select("#svgClustering");

    var force = d3.layout.force()
        .nodes(nodes)
        .links([])
        .size([width, height])
        .start();

    var node = vis.selectAll("circle.node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", 8)
        .style("fill", function (d, i) {
            return fill(i & 3);
        })
        .style("stroke", function (d, i) {
            return d3.rgb(fill(i & 3)).darker(2);
        })
        .style("stroke-width", 1.5)
        .call(force.drag);

    vis.style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    force.on("tick", function (e) {

        // Push different nodes in different directions for clustering.
        var k = 6 * e.alpha;
        nodes.forEach(function (o, i) {
            o.x += i & 2 ? k : -k;
            o.y += i & 1 ? k : -k;
        });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });

        vis.selectAll("path")
            .data(groups)
            .attr("d", groupPath)
            .enter().insert("path", "circle")
            .style("fill", groupFill)
            .style("stroke", groupFill)
            .style("stroke-width", 40)
            .style("stroke-linejoin", "round")
            .style("opacity", .2)
            .attr("d", groupPath);
    });

    d3.select("body").on("click", function () {
        nodes.forEach(function (o, i) {
            o.x += (Math.random() - .5) * 40;
            o.y += (Math.random() - .5) * 40;
        });
        force.resume();
    });
}