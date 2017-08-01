/**
 * Created by Bean on 29-Jul-17.
 */
// provide the data in the vis format
var data = {};  //globally
var nodes = new vis.DataSet({});
var edges = new vis.DataSet({});

// functions to convert Neo4j res to dataset format
function idIndex(a, id) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return i;
    }
    return null;
}
//check object exist
Array.prototype.hasElement = function (element) {
    var i;
    for (i = 0; i < this.length; i++) {
        if (this[i]["from"] === element["from"] && this[i]["to"] === element["to"] && this[i]["type"] === element["type"]) {
            return i; //Returns element position, so it exists
        }
    }
    return -1; //The element isn't in your array
};

//check object's id exist in dataset
var hasId = function (element) {
    // retrieve a filtered subset of the data
    var items;
    if (element["id"] != undefined) {
        items = nodes.get({
            filter: function (item) {
                return (item.id === element["id"]);
            }
        });
    }
    else {
        items = edges.get({
            filter: function (item) {
                return (item.from === element["from"] && item.to === element["to"] && item.type === element["type"]);
            }
        });
    }
    return items.length;
};

function convertToJson(res) {
    var nodes = [], links = [];
    res.results[0].data.forEach(function (row) {
        row.graph.nodes.forEach(function (n) {
            if (idIndex(nodes, n.id) == null) {
                if (n.properties.name) {
                    if (n.properties.name == "Topic Evolution") nodes.push({
                        id: n.id,
                        label: n.properties.name,
                        title: n.labels[0],
                        shape: 'circle',
                        group: n.labels[0]
                    });
                    else nodes.push({id: n.id, label: n.properties.name, shape: 'star', group: n.labels[0]});     //topic
                }
                else if (n.properties.title)
                    nodes.push({
                        id: n.id,
                        label: n.id,
                        title: n.properties.title,
                        path: n.properties.pathFile,
                        shape: 'box',
                        group: n.labels[0]
                    });     //paper
                else   nodes.push({id: n.id, label: n.properties.value, group: n.labels[0], shape: 'ellipse'}) //timestamp
            }
        });
        row.graph.relationships.map(function (r) {
            var s = {from: r.startNode, to: r.endNode, title: r.type};
            if (links.hasElement(s) === -1) {
                links.push(s);
            }
        });
    });
    var data = {nodes: nodes, edges: links};
    return data;
};


$.ajaxSetup({
    headers: {
        "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + "1234567")
    }
});

$.ajax({
    type: "POST",
    url: "http://localhost:7474/db/data/transaction/commit",
    data: JSON.stringify({
        statements: [{
            //statement: "MATCH p=()-[r:has]-() return p",
            statement: "MATCH(n:Root) return n",
            resultDataContents: ["row", "graph"]
        }]
    }),
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    error: function (err) {
        console.log(err)
    },
    success: function (res) {
        var jsonRes = convertToJson(res);
        nodes.add(jsonRes.nodes);
        edges.add(jsonRes.edges);
        data = {nodes: nodes, edges: edges};

        //create a network
        var container = document.getElementById('vis');

        // initialize your network!
        var options = {
            interaction: {hover: true},
            autoResize: true,
            height: '95%',
            width: '100%'
        };
        var network = new vis.Network(container, data, options);

        network.on("selectNode", function (params) {
            console.log('selectNode Event:', nodes.get(params.nodes)[0]);
            var item = nodes.get(params.nodes);
            $("#key").html(item[0].group);
            if (item[0].group === "Paper") {
                $.ajax({
                    type: "POST",
                    url: "/details",
                    data: item[0],
                    dataType: "text",
                    error: function (err) {
                        console.log(err)
                    },
                    success: function (res) {
                        $("#id").html($(res).find('#id').text());
                        $("#titleFile").html($(res).find('#titleFile').text());
                        $("#intro").html($(res).find('#intro').text());
                        $("#contentFile").html($(res).find('#contentFile').text());
                        $("#url").html($(res).find('#url').text());
                    }
                });
                $("#content").html(item[0].title);
            }
            else $("#content").html(item[0].label);

            $.ajaxSetup({
                headers: {
                    "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + "1234567")
                }
            });

            $.ajax({
                type: "POST",
                url: "http://localhost:7474/db/data/transaction/commit",
                data: JSON.stringify({
                    statements: [{
                        statement: "MATCH (t) WHERE ID(t) =" + params.nodes + " MATCH p=()-[]-(t) return p",
                        resultDataContents: ["row", "graph"]
                    }]
                }),
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                error: function (err) {
                    console.log(err)
                },
                success: function (res) {
                    var resJson2 = convertToJson(res);
                    console.log(resJson2.nodes);
                    resJson2.nodes.forEach(function (node) {
                        if (hasId(node) === 0) nodes.add(node);
                    })

                    resJson2.edges.forEach(function (edge) {
                        if (hasId(edge) === 0) edges.add(edge);
                    })
                    network.stabilize;
                }
            });
        });
    }
});



