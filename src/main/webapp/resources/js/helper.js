/**
 * Created by Bean on 13-Sep-17.
 */

// functions to convert Neo4j res to dataset format
var idIndex = function (a, id) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return i;
    }
    return null;
}

//edit progress bar
var  updateProgressBar = function (key, probability, bar){
    var element = "." + bar;
    $(element).css('width', (probability*100).toFixed(2) + "%").text(key+"("+ (probability*100).toFixed(2) + "%)");
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

// functions to compare two array
var isTheSame = function (arr1, arr2) {
    if(arr1.length != arr2.length)
        return false;

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

//convert neo4j data res to json array
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

//convert to Timeline (Vis.js) format
var convertToTimelineFormat = function (key, array) {
    var startDate = array[0], endDate = array[0], index = 0;
    var data = [];
    for (var i = 1; i < array.length; i++) {
        var date1 = array[i-1].split('/');
        var prevDate = new Date(date1[2], date1[1]-1, date1[0]);

        var date2 = array[i].split('/');
        var nowDate = new Date(date2[2], date2[1] - 1, date2[0]);

        if ((nowDate - prevDate) != (24 * 60 * 60 * 1000)) {
            var start = startDate.split('/');
            var end = endDate.split('/');
            if(isTheSame(start,end))
                data.push({group: 1, content: startDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0], 23, 59, 59, 59)});
            else
            data.push({group: 1, content: "from " + startDate + " to " + endDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0])});
            startDate = array[i];
            endDate = startDate;
        }
        else {
            endDate = array[i];
        }
    }
    var start = startDate.split('/');
    var end = endDate.split('/');
    if(isTheSame(start,end))
        data.push({group: 1, content: startDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0], 23, 59, 59, 59)});
    else
        data.push({group: 1, content: "from " + startDate + " to " + endDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0])});
    console.log(data);

    return data;
}

//helper of groupTimelines
var convertToTimelineFormatByGroup = function (key, array, group){
    var startDate = array[0].time, endDate = array[0].time, index = 0;
    var data = [];
    for (var i = 1; i < array.length; i++) {
        var date1 = array[i-1].time.split('/');
        var prevDate = new Date(date1[2], date1[1]-1, date1[0]);

        var date2 = array[i].time.split('/');
        var nowDate = new Date(date2[2], date2[1] - 1, date2[0]);

        if ((nowDate - prevDate) != (24 * 60 * 60 * 1000)) {
            var start = startDate.split('/');
            var end = endDate.split('/');
            if(isTheSame(start,end))
                data.push({group: group, content: startDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0], 23, 59, 59,59)});
            else
                data.push({group: group, content: "from " + startDate + " to " + endDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0])});
            startDate = array[i].time;
            endDate = startDate;
        }
        else {
            endDate = array[i].time;
        }
    }
    var start = startDate.split('/');
    var end = endDate.split('/');
    if(isTheSame(start,end))
        data.push({group: group, content: startDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0], 23, 59, 59, 59)});
    else
        data.push({group: group, content: "from " + startDate + " to " + endDate, start: new Date(start[2], start[1]-1, start[0]), end: new Date(end[2], end[1]-1, end[0])});
    return data;
}

//convert to Timeline (Vis.js) format by group
var groupTimelines = function (array)
{
    var data = [];
    for(var i=0; i < array.length; i++){
        var obj = array[i];
        data = data.concat(convertToTimelineFormatByGroup(obj.keyword, obj.timelines, i+1));
    }
    return data;
}

//get group name from an array
var extractGroup = function(array){
    var groups = [];
    for(var i=0; i < array.length; i++){
        groups.push({id: (i+1), content: array[i].keyword});
    }
    return groups;
}