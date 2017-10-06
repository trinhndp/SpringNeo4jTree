/**
 * Created by Bean on 13-Sep-17.
 */

function drawTimeline(data, group){
    $("#vis").empty();
    var container = document.getElementById('vis');

// Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(data);

//Initialize group
    if(group.length != 0)
    {
        var groups = new vis.DataSet();
        groups.add(group);
    }

    console.log(items.toString());
// Configuration for the Timeline
    var options =  {
        groupOrder: 'content',
        height: '430px',
        min: new Date(2017, 5, 1),                // lower limit of visible range
        max: new Date(2017, 12, 31),                // upper limit of visible range
        zoomMin: 1000*60 * 60 * 24,             // one day in milliseconds
        zoomMax: 1000*60 * 60 * 24 * 31 * 3     // about three months in milliseconds
    };

// Create a Timeline
    var timeline = new vis.Timeline(container);
    timeline.setOptions(options);
    if(group.length != 0) timeline.setGroups(groups);
    timeline.setItems(items);
}