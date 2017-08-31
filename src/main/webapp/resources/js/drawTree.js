/**
 * Created by Bean on 29-Jul-17.
 */
// provide the data in the vis format
var data = {};  //globally
var passwd = "1234567";
var nodes = new vis.DataSet({});
var edges = new vis.DataSet({});

// functions to convert Neo4j res to dataset format
var idIndex = function (a, id) {
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

var convertToJson = function(res) {
    var nodes = [], links = [];
    res.results[0].data.forEach(function (row) {
        row.graph.nodes.forEach(function (n) {
            if (idIndex(nodes, n.id) == null) {
                if (n.properties.name) {
                    if (n.properties.name == "Root") nodes.push({
                        id: n.id,
                        label: n.properties.name,
                        title: n.labels[0],
                        group: n.labels[0]
                    });
                    else nodes.push({id: n.id, label: n.properties.name, group: n.properties.name, name: n.labels[0]});     //topic
                }
                else if (n.properties.title)
                    nodes.push({
                        id: n.id,
                        label: n.id,
                        title: n.properties.title,
                        path: n.properties.path,
                        group: n.labels[0]
                    });     //paper
                else   nodes.push({id: n.id, label: n.properties.value, group: n.labels[0]}) //timestamp
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

var  updateProgressBar = function (key, probability, bar){
    var element = "." + bar;
    $(element).css('width', (probability*100).toFixed(2) + "%").text(key+" ("+ (probability*100).toFixed(2) + "%)");
}

function initalize(){
    $("#vis").empty();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    nodes = new vis.DataSet({});
    edges = new vis.DataSet({});
}

var drawGraph = function(){
    initalize();
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
                height: '100%',
                width: '100%',
                groups: {
                    Root: {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf1bb',
                            size: 30,
                            color: '#00EE00'
                        }
                    },
                    Timestamp: {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf073',
                            size: 25,
                            color: '#CC00CC'
                        }
                    },
                    Paper: {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf1ea',
                            size: 25,
                            color: '#FF9900'
                        }
                    },
                    "VNExpress-GiaoDuc": {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf0eb',
                            size: 25,
                            color: "#CC0000"
                        }
                    },
                    "VNExpress-ThoiSu": {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf0eb',
                            size: 25,
                            color: "#6633FF"
                        }
                    },
                    "VNExpress-PhapLuat": {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf0eb',
                            size: 25,
                            color: "#00CCFF"
                        }
                    },
                    "VNExpress-TheGioi": {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf0eb',
                            size: 25,
                            color: "#336666"
                        }
                    },
                    "VNExpress-KhoaHoc": {
                        shape: 'icon',
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf0eb',
                            size: 25,
                            color: "#993366"
                        }
                    }
                }
            };

            var network = new vis.Network(container, data, options);

            network.on("selectNode", function (params) {
                console.log(params.nodes);
                console.log('selectNode Event:', nodes.get(params.nodes)[0]);
                var item = nodes.get(params.nodes);
                $("#key").html(item[0].group);
                if (item[0].group === "Paper") {
                    $(".topWord").css("display", "none");
                    $(".paper-content").css("display", "block");
                    $("#title-detailTable").html("Paper's content");
                    $.ajax({
                        type: "POST",
                        url: "/details",
                        data: item[0],
                        dataType: "text",
                        error: function (err) {
                            console.log(err)
                        },
                        success: function (res) {
                            $("#id").html("PaperID: " + $(res).find('#id').text());
                            $("#titleFile").html($(res).find('#titleFile').text());
                            $("#intro").html($(res).find('#intro').text());
                            $("#contentFile").html($(res).find('#contentFile').text());
                            $("#url").html($(res).find('#url').text());
                        }
                    });
                }
                else if (item[0].name === "Topic") {
                    $("#title-detailTable").html("Top-Words List");
                    //hide content table
                    $(".topWord").css("display", "block");
                    $(".paper-content").css("display", "none");
                    //get top words from neo4j
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:7474/db/data/transaction/commit",
                        data: JSON.stringify({
                            statements: [{
                                statement: "MATCH (t:Topic) WHERE id(t) =" + params.nodes + " MATCH p=(w:KeyWord)-[r]->(t) return p ORDER BY r.weight DESC LIMIT 10",
                                resultDataContents: ["row", "graph"]
                            }]
                        }),
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",
                        error: function (err) {
                            console.log(err)
                        },
                        success: function (res) {
                            console.log(res);
                            // remove progress bars
                            $('.progress').detach();
                            var order = 1;
                            res.results[0].data.forEach(function (row) {
                                var value, probability;
                                row.graph.nodes.forEach(function (n) {
                                    if(n.properties.value) {
                                        value = n.properties.value;
                                    }
                                })

                                row.graph.relationships.map(function (r) {
                                    probability = r.properties.weight;
                                });
                                console.log(value + ":" + probability);
                                $('.topWord').append('<div class="progress"><div class="progress-bar progress-bar-striped topWord' + order + '" role="progressbar" aria-valuemin="0" aria-valuemax="100"> </div></div>');
                                updateProgressBar(value, probability, "topWord" + order);
                                order+=1;

                            })
                        }
                    });
                }
                else {
                    console.log("root or time");
                    $(".topWord").css("display", "none");
                    $(".paper-content").css("display", "none");
                    $("#title-detailTable").html("Content Details");
                }

                $.ajaxSetup({
                    headers: {
                        "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
                    }
                });
                $.ajax({
                    type: "POST",
                    url: "http://localhost:7474/db/data/transaction/commit",
                    data: JSON.stringify({
                        statements: [{
                            statement: "MATCH (t) WHERE ID(t) =" + params.nodes + " MATCH p=()<-[]-(t) return p",
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
}









