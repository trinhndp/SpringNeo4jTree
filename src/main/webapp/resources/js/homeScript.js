/**
 * Created by Bean on 30-Jul-17.
 */
var dataJson = [];
$(document).ready(function () {
    //helper
    jQuery.validator.addMethod("noSpace", function (value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "No space please, like sinh_viên.");

    // jQuery.validator.addMethod("noDigits", function(text) {
    //     var letters = /^[A-Za-z]+$/;
    //     if(text.value.match(letters))
    //         return true;
    //     else return false;
    // }, "Your word must not contains digits please.");

    //before open modal
    $('#timelineWord').on('shown.bs.modal', function () {
        $("#timelineWordForm")[0].reset();
    })
    $('#timelineTopic').on('shown.bs.modal', function () {
        $("#timelineTopicForm")[0].reset();
    })
    $('#statisticsOfKeyword').on('shown.bs.modal', function () {
        $("#statisticsOfKeywordForm")[0].reset();
    })
    $('#barChart').on('shown.bs.modal', function () {
        $("#barChartForm")[0].reset();
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
                // noDigits: true,
                noSpace: true,
                minlength: 4
            }
        },
        messages: {
            keyword: {
                required: "Please provide a specific keyword, not including space. Ex: cảnh_sát.",
                minlength: "Your data must be at least 4 characters.",
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
                noSpace: true
            }
        },
        messages: {
            word: {
                required: "Please enter a word without space",
            }
        },
        submitHandler: function () {
            getTotalPapers();
        }
    });
    $("#barChartForm").validate({
        rules: {
            bWord: {
                required: true,
                // noDigits: true,
                noSpace: true
            }
        },
        messages: {
            bWord: {
                required: "Please enter a word without space",
                // noDigits: "Your word must not include integers.",
            }
        },
        submitHandler: function () {
            getContinousFrequency();
        }
    });
    $("#clusteringForm").validate({
        submitHandler: function () {
            getClusteringGroup();
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
        // window.close();
        $(this).modal("hide");
    })
});

function getTotalPapers() {
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
                statement: "MATCH (time:Timestamp) WITH time MATCH (time:Timestamp)-[]-(topic:Topic) WITH time, topic  MATCH (n:KeyWord)-[]-(p:Paper)-[]-(topic)-[]-(time) WHERE n.value = \'" + $('#word').val() + "\' return time, topic, count(p) ORDER BY time asc",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var data = [], groups = [];
            $("#vis").empty();
            if (res.results[0] == undefined) {
                $("#vis").append('Data not found');
            }
            else if (res.results[0].data.length != 0) {
                var max = 0;
                res.results[0].data.forEach(function (row) {
                    var date = changeTo2dFormatTime(row.row[0].value);
                    if (groups.indexOf(row.row[1].name) == -1) groups.push(row.row[1].name);
                    if (max < row.row[2]) max = row.row[2];
                    data.push({x: date, y: row.row[2], group: row.row[1].name});
                })
                console.log(data);

                if (data.length > 0) {
                    // data = completeTimelineOfChart(data, groups);
                    // console.log(data);
                    // draw2DLineChart(data, groups);
                    draw2DbarChart(data, groups, max + 5);
                }

                $("#vis").append('<h4 align="center"> The statistic reflects total papers using the keyword "' + $("#word").val() + '"</h4>');
            }
            else $("#vis").append('Data not found');
        }
    })
    $("#statisticsOfKeyword").modal("hide");
}

function getContinousFrequency() {
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
                statement: "MATCH (time:Timestamp) WITH time MATCH (time:Timestamp)-[]-(topic:Topic) WITH time, topic  MATCH (n:KeyWord)-[r:presents]-(topic)-[]-(time) WHERE n.value = \'" + $('#bWord').val() + "\' return time, topic, r.weight ORDER BY time asc",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var data = [], groups = [];
            var max = 0;
            $("#vis").empty();
            if (res.results[0] == undefined) {
                $("#vis").append('Data not found');
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    if (max < row.row[2]) max = row.row[2];
                    var date = changeTo2dFormatTime(row.row[0].value);
                    if (groups.indexOf(row.row[1].name) == -1) groups.push(row.row[1].name);
                    data.push({x: date, y: (row.row[2] * 100).toFixed(2), group: row.row[1].name});
                })
                console.log(data);
                console.log(Math.round((max * 100) + 1));

                if (data.length > 0) {
                    data = completeTimelineOfChart(data, groups);
                    console.log(data);
                    // draw2DbarChart(data, groups, Math.round(Math.round((max*100)+5)));
                    draw2DLineChart(data, groups);
                }
                $("#vis").append('<h4 align="center"> The statistic reflects term frequency using the keyword "' + $("#bWord").val() + '"</h4>');
            }
            else $("#vis").append('Data not found');
        }
    })
    $("#barChart").modal("hide");
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
                statement: "MATCH (p:Paper) WHERE id(p) =" + $('#fPaperId').val() + " MATCH s=(w:KeyWord)-[r]->(p) return s ORDER BY r.weight DESC LIMIT " + $("#fLimit").find('option:selected').text(),
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

                    $('.topWordModal').append('<div class="progress"><div class="progress-bar progress-bar-striped topwordModal' + order + '" role="progressbar" aria-valuemin="0" aria-valuemax="100"> </div></div>');
                    updateProgressBar(value, probability, "topwordModal" + order);
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
            $("#vis").empty();
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
                statement: "MATCH (topic:Topic)-[]-(keyword:KeyWord) where topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" WITH keyword limit " + $("#keywordLimit").find('option:selected').text() + "  MATCH (time:Timestamp)-[]-(topic:Topic)-[]-(keyword) where topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" return keyword, time order by keyword, time asc",
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
            $("#vis").empty();
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

function getClusteringGroup() {
    //get vectorTong và vectorPaper de tinh KMedoids
    var vectorTong = [];
    var vectorPapers = [];

    var start = $("#startDay").find('option:selected').text();
    var number = parseInt($("#endDay").find('option:selected').text());
    var date = start.trim().split('/');
    console.log(date);

    var someDate = new Date(date[2], date[1] - 1, date[0], 0, 0, 0, 0);
    // console.log("day " + someDate);
    someDate.setDate(someDate.getDate() + number); //because of taking less than it
    console.log("someDate " + someDate);

    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });

    //get all distinct Keywords of all Papers above.
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (topic:Topic)-[]-(t:Timestamp) where t.dateFormat < '" + changeToNeo4jFormatTime(someDate) + "' with id(topic) as id, t MATCH (k:KeyWord)-[rel:presents]-(topic:Topic) where id(topic) = id with k, t MATCH (k)-[r:presents]-(p:Paper) return distinct k, t, r.weight ORDER BY r.weight DESC LIMIT 40",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            if (res.results[0] == undefined) {
                console.log("data not found");
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    row.graph.nodes.forEach(function (n) {
                        if (n.labels == "KeyWord") {
                            if (existKeyword(vectorTong, n.properties.value) == -1)
                                vectorTong.push(n.properties.value);
                        }
                    })
                })
            }

            console.log(vectorTong);
        }
    });

    //get all Papers belonging to ? date
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (p:Paper)-[]-()-[]-(t:Timestamp) where t.dateFormat < '" + changeToNeo4jFormatTime(someDate) + "' with p MATCH (p)-[]-(k:KeyWord) return id(p), k",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            if (res.results[0] == undefined) {
                console.log("data not found");
            }
            else if (res.results[0].data.length != 0) {
                var idPaper = 0;
                var vector = [];
                res.results[0].data.forEach(function (row) {
                    if (idPaper != 0 && idPaper != row.row[0]) {
                        vectorPapers.push(convert2VectorKMedoids(vectorTong, vector, idPaper));
                        vector = [];
                    }
                    if (idPaper != row.row[0]) idPaper = row.row[0];
                    row.graph.nodes.forEach(function (n) {
                        if (existKeyword(vector, n.properties.value) == -1)
                            vector.push(n.properties.value);
                    })
                })
                vectorPapers.push(convert2VectorKMedoids(vectorTong, vector, idPaper));
            }

            console.log(vectorPapers);
            $.ajax({
                // traditional: true,
                type: "POST",
                url: "/clustering",
                data: {arr: JSON.stringify(vectorPapers)},
                // contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    var json = $(data).find('#jsonRes').text();
                    var data = convertToD3DataFormat(json);
                    // $("#clusterModal").modal("show");
                    $("#vis").empty();
                    clustering(data);
                    dataJson = findTopKeywordsOfCluster(data);
                },
                error: function (errMsg) {
                    alert("error !!!");
                }
            });
        }
    });

    $("#clustering").modal("hide");
}

function findTopKeywordsOfCluster(data) {
    //data =     [{"name": "18956", "rating": "0.1969418493", "group": "3"}];
    var keywordList = [];
    var group1=[], group2=[], group3=[], group4=[], group5=[], group6=[];
    for(var i = 0; i < data.length; i++){
        var row = data[i];
        if(row.group == "1")
            group1.push(row.name);
        else if(row.group == "2")
            group2.push(row.name);
        else if(row.group == "3")
            group3.push(row.name);
        else if(row.group == "4")
            group4.push(row.name);
        else if(row.group == "5")
            group5.push(row.name);
        else if(row.group == "6")
            group6.push(row.name);
    }

    var list1 = getKeywordsOfEachPaper(group1);
    var list2 = getKeywordsOfEachPaper(group2);
    var list3 = getKeywordsOfEachPaper(group3);
    var list4 = getKeywordsOfEachPaper(group4);
    var list5 = getKeywordsOfEachPaper(group5);
    var list6 = getKeywordsOfEachPaper(group6);

    keywordList.push({"1": list1, "2": list2, "3": list3, "4": list4, "5": list5, "6": list6});
    console.log("list keywords");
    console.log(keywordList);

    // $.ajax({
    //     // traditional: true,
    //     type: "POST",
    //     url: "/getTopKeywords",
    //     data: {arr: JSON.stringify(keywordList)},
    //     // contentType: "application/json; charset=utf-8",
    //     dataType: "text",
    //     success: function (data) {
    //        alert(data);
    //     },
    //     error: function (errMsg) {
    //         alert("error !!!" +  errMsg);
    //     }
    // });
}

function getKeywordsOfEachPaper(listOfId) {
    var keywordList = [];
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa("neo4j" + ":" + passwd)
        }
    });
    //get all keywords belonging to each paper based on id(paper)
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (k:KeyWord)-[r:presents]-(p:Paper) WHERE id(p) IN [" + listOfId + "] return id(p), k.value, r.weight",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var keywords = [];
            var id = 0;
            if (res.results[0] == undefined) {
                console.log("data not found");
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    if(id != row.row[0] && id != 0) {
                        var obj = {};
                        // console.log(id + " has " + keywords.length + " words");
                        obj[id] = keywords;
                        keywordList.push(obj);
                        keywords = [];
                    }
                    id = row.row[0];
                    var keyw = row.row[1];
                    var word = {};
                    word[keyw] = row.row[2];
                    keywords.push(word);
                   // console.log(row);
                })
            }
            var lastObj = {};
            lastObj[id] = keywords;
            keywordList.push(lastObj);
        }
    })
    return keywordList;
}
