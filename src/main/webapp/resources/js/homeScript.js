/**
 * Created by Bean on 30-Jul-17.
 */
$(document).ready(function () {
    //helper
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "No space please, like sinh_viên");

    //before open modal
    $('#timelineWord').on('shown.bs.modal', function(){
        $("#timelineWordForm")[0].reset();
    })
    $('#timelineTopic').on('shown.bs.modal', function(){
        $("#timelineTopicForm")[0].reset();
    })

    //validate form
    $("#top10KeywordForm").validate({
        rules: {
            fPaperId: {
                required: true,
                digits: true,
                minlength: 4
            }
            ,
            fLimit: {
                required: true,
                digits: true
            }
        },
        messages: {
            fPaperId: {
                required: "Please enter paper's id",
                minlength: "Your data must be at least 4 characters.",
                digits: "Your paper's id must be an integer."
            },
            fLimit: {
                required: "Please provide the limitation of searching data.",
                digits: "The positive integer number is required."
            },
        },
        submitHandler: function () {
            getNKeywords();
        }
    });
    $("#timelineWordForm").validate({
        rules: {
            keyword: {
                required: true,
                digits: false,
                noSpace: true,
                minlength: 4
            }
        },
        messages: {
            keyword: {
                required: "Please provide a specific keyword, not including space. Ex: cảnh_sát.",
                minlength: "Your data must be at least 4 characters.",
                digits: "It doesn not include integers."
            }
        },
        submitHandler: function () {
            getTimelineOfWord();
        }
    });
    $("#timelineTopicForm").validate({
        rules: {
            limit: {
                required: true,
                digits: true
            }
        },
        messages: {
            limit: {
                required: "Please enter the number of keyword.",
                digits: "The positive number is required."
            },
        },
        submitHandler: function () {
            getTimelineOfTopic();
        }
    });
    $("#statisticsOfKeywordForm").validate({
        rules: {
            word: {
                required: true,
                digits: false,
                noSpace: true
            }
        },
        messages: {
            fPaperId: {
                required: "Please enter a word without space",
                digits: "Your word must not include integers."
                // noSpace: "No space please, like sinh_viên"
            }
        },
        submitHandler: function () {
            getTotalPapers();
        }
    });

    //changes in MENU bar
    $('.nav li').click(function (e) {
        $('.nav li').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        //e.preventDefault();
    });
    $('.btn-close').click(function (e) {
        // window.location.reload(true);
        window.close();
    })
});

function getTotalPapers(){
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement:"MATCH (time:Timestamp) WITH time MATCH (time:Timestamp)-[]-(topic:Topic) WITH time, topic  MATCH (n:KeyWord)-[]-(p:Paper)-[]-(topic)-[]-(time) WHERE n.value = \'"+ $('#word').val() +"\' return time, topic, count(p) ORDER BY time asc",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var data = [], groups =[];
            if (res.results[0] == undefined) {
                $("#vis").append('Data not found');
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    var date = changeTo2dFormatTime(row.row[0].value);
                    if(groups.indexOf(row.row[1].name) == -1) groups.push(row.row[1].name);
                    data.push({x: date, y: row.row[2], group: row.row[1].name});
                })
                console.log(data);

                if(data.length > 0){
                    data = completeTimelineOfChart(data, groups);
                    // console.log(data);
                    draw2dChart(data, groups);
                }

                $("#vis").append('<h4 align="center"> The statistic reflects using the keyword "' + $("#word").val() + '"</h4>');
            }
            else $("#vis").append('Data not found');
        }
    })
    $("#statisticsOfKeyword").modal("hide");
}

function getNKeywords() {
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (p:Paper) WHERE id(p) =" + $('#fPaperId').val() + " MATCH s=(w:KeyWord)-[r]->(p) return s ORDER BY r.weight DESC LIMIT " + $('#fLimit').val(),
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            // var sample = [];
            var order = 1;
            //remove old content
            $(".topWordModal").empty();
            if (res.results[0] == undefined) {
                $(".topWordModal").append('<p>Data not found.</p>');
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    var value = [], probability = [];
                    row.graph.nodes.forEach(function (n) {
                        if (n.properties.value) {
                            value = n.properties.value;
                        }
                    })

                    row.graph.relationships.map(function (r) {
                        probability = r.properties.weight;
                    });

                    $('.topWordModal').append('<div class="progress"><div class="progress-bar progress-bar-striped topWord' + order + '" role="progressbar" aria-valuemin="0" aria-valuemax="100"> </div></div>');
                    updateProgressBar(value, probability, "topWord" + order);
                    order++;
                })
            }
            else $(".topWordModal").append('<p>Data not found.</p>');
        }
    })
    $("#top10Keyword").modal("hide");
    $("#findTopWordModal").modal("show");

    //refresh
    $('#fPaperId').val('');
    $('#fLimit').val('');
}

function getTimelineOfWord() {
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (time:Timestamp)-[]-(topic:Topic)-[]-(k:KeyWord) WHERE k.value = \"" + $('#keyword').val() + "\" AND topic.name = \"" + $("#topicDropdown").find('option:selected').text() + "\" return time ORDER BY time asc",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var value = [];
            if (res.results[0] == undefined) {
                console.log("data not found");
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    row.graph.nodes.forEach(function (n) {
                        if (n.properties.value) {
                            value.push(n.properties.value);
                        }
                    });
                })
            }
            else $("#vis").append('<h3>Data not found.</h3>');

            if (value.length != 0) {
                var timelines = convertToTimelineFormat($('#keyword').val(), value);
                var groups = extractGroup([{keyword: $("#topicDropdown").find('option:selected').text()}]);
                drawTimeline(timelines, groups);
                $("#vis").append('<h4 align="center"> Lifetime of keyword "' + $("#keyword").val() + '" in topic "' + $("#topicDropdown").find('option:selected').text() + '"</h4>');
            }
        }
    });
    $("#timelineWord").modal("hide");
}

function getTimelineOfTopic() {
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (topic:Topic)-[]-(keyword:KeyWord) where topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" WITH keyword limit " + $('#limit').val() + "  MATCH (time:Timestamp)-[]-(topic:Topic)-[]-(keyword) where topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" return keyword, time order by keyword, time asc",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var data = [];
            var timeArray = [], word, prevWord, time;
            if (res.results[0] == undefined) {
                console.log("data not found");
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    row.graph.nodes.forEach(function (n) {
                        if (n.labels[0] == "KeyWord") {
                            word = n.properties.value;
                        }
                        if (n.labels[0] == "Timestamp") {
                            time = n.properties.value;
                        }
                    });

                    if (prevWord == undefined && word != undefined) {
                        prevWord = word;
                        timeArray.push({time: time});
                    }
                    else if (prevWord != word) {
                        data.push({keyword: prevWord, timelines: timeArray});
                        prevWord = word;
                        timeArray = [];
                        timeArray.push({time: time});
                    }
                    else timeArray.push({time: time});
                });
            }
            else $("#vis").append('<h3>Data not found.</h3>');
            //push last object
            if (word != undefined && timeArray != undefined) data.push({keyword: word, timelines: timeArray});

            if (data.length != 0) {
                var timelines = groupTimelines(data);
                var groups = extractGroup(data);
                drawTimeline(timelines, groups);
                $("#vis").append('<h4 align="center"> Lifetime of keywords of topic "' + $("#chosenTopicDropdown").find('option:selected').text() + '" </h4>');
            }
        }
    });
    $("#timelineTopic").modal("hide");
}

function changeTo2dFormatTime(value){
    var date = value.split('/');
    if(date[1][0] == '0') date[1] = date[1].substring(1,2);
    if(date[0][0] == '0') date[0] = date[0].substring(1,2);
    return date[2] + "-"+ date[1] + "-"+  date[0];
}