/**
 * Created by trinhndp on 07-Oct-17.
 */
//style of point
    var style = ["circle", "square"];



var draw2dChart = function(data, group){
    $("#vis").empty();
    var container = document.getElementById('vis');
    var items = data;


    // create a dataSet with groups
    var groups = new vis.DataSet();

    group.forEach(function (n){
        console.log(n);

        groups.add({
            id: n,
            content: n,
            options: {
                drawPoints: style[Math.floor((Math.random() * 2) + 1)]
            }});
    });

    var dataset = new vis.DataSet(items);
    var options = {
        drawPoints: false,
        dataAxis: {visible: true},
        legend: true,
        start:  new Date(2017, 5, 1),
        end: new Date(2017, 12, 31)
    };
    // var graph2d = new vis.Graph2d(container, dataset, options);
    var graph2d = new vis.Graph2d(container, dataset, groups, options);
}
