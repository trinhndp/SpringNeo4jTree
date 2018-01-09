/**
 * Created by trinhndp on 07-Oct-17.
 */
//style of point
    var style = ["square", "circle"];

var draw2DLineChart = function(data, group){
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
                drawPoints: style[Math.floor(Math.random() * 2)]
            },
            shaped: {
                orientation: 'bottom'
            }
        });
    });

    var dataset = new vis.DataSet(items);
    var options = {
        drawPoints: false,
        dataAxis: {
            visible: true,
            left: {
                title: {text: "The score in the ranking system([1,30])"}
            }
        },
        legend: true,
        start:  new Date(2017, 8, 30),
        end: new Date(2017, 10, 31)
    };


    var graph2d = new vis.Graph2d(container, dataset, groups, options);
}
