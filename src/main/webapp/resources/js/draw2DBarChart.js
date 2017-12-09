/**
 * Created by Bean on 22-Oct-17.
 */


var draw2DbarChart = function (data, group, max) {
    var container = document.getElementById('vis');

    var groups = new vis.DataSet();
    group.forEach(function (n) {
        groups.add({
            id: n,
            content: n,
            className: n,
            options: {
                style: 'bar',
                barChart: {width: 25, align: 'center', sideBySide: true}, // align: left, center, right
                drawPoints: {
                    style: 'square',
                    size: 5
                },
            }
        });
    });

    var items = new vis.DataSet(data);
    var options = {
        legend: {right: {position: 'top-right'}},
        yAxisOrientation: 'left', // right, left
        dataAxis: {
            left: {
                range: {min: 0, max: max},
                title: {text: "Total papers using this keyword"}
            },
            icons: true
        },
        orientation:'top',
        start: new Date(2017, 5, 1),
        end: new Date(2017, 12, 31)
    };

    var graph2dbar = new vis.Graph2d(container, items, groups, options);
}