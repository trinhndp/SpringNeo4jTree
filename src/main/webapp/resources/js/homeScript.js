/**
 * Created by Bean on 30-Jul-17.
 */

/* declare global variable*/
/* password to connect neo4j */
var user = "neo4j";
var passwd = "1234567";

window.onload = function () {
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
        }
    });
    //get the minDay and maxDay in db
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "match (t:Timestamp) return max(t.dateFormat), min(t.dateFormat)",
                resultDataContents: ["row", "graph"]
            }]
        }),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var select = document.getElementById("startDay");
            var select2 = document.getElementById("chosenDate");
            var maxLastestDay, minLastestDay;
            res.results[0].data.forEach(function (row) {
                maxLastestDay = new Date(row.row[0]);
                minLastestDay = new Date(row.row[1]);
            })

            for (var i = maxLastestDay; i >= minLastestDay; i.setDate(i.getDate() - 1)) {
                var option = document.createElement('option');
                option.text = option.value = i.toISOString().split('T')[0];
                select.add(option, 0);
                var option2 = document.createElement('option');
                option2.text = option2.value = i.toISOString().split('T')[0];
                select2.add(option2, 0)
            }
        }
    });
};

$(document).ready(function () {
    //helper
    jQuery.validator.addMethod("noSpace", function (value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "No space please, like sinh_viên.");

    jQuery.validator.addMethod("noDigits", function (text) {
        var letters = /^[A-Za-z]+$/;
        if (text.value.match(letters))
            return true;
        else return false;
    }, "Your word must not contains digits please.");

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
    $('#top10Keyword').on('shown.bs.modal', function () {
        $("#top10KeywordForm")[0].reset();
    })

    //validate form
    $("#top10KeywordForm").validate({
        rules: {
            fPaperId: {
                required: true,
                digits: true,
                minlength: 1
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
                minlength: 2
            }
        },
        messages: {
            keyword: {
                digits: "The word does not contain numberic character.",
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
    resetDetailTable();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
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
                $("#vis").append('<h3>Sorry! But, no data found.</h3>');
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
            else $("#vis").append('<h3>Sorry! But, no data found.</h3>');
        }
    })
    $("#statisticsOfKeyword").modal("hide");
}

function getContinousFrequency() {
    resetDetailTable();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (time:Timestamp) WITH time MATCH (time:Timestamp)-[]-(topic:Topic) WITH time, topic  MATCH (n:KeyWord)-[r:presents]-(topic)-[]-(time) WHERE n.value = \'" + $('#bWord').val() + "\' return time, topic, r.rank ORDER BY time asc",
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
                $("#vis").append('<h3>Sorry! But, no data found.</h3>');
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    if (max < row.row[2]) max = row.row[2];
                    var date = changeTo2dFormatTime(row.row[0].value);
                    if (groups.indexOf(row.row[1].name) == -1) groups.push(row.row[1].name);
                    data.push({x: date, y: (31 - row.row[2]), group: row.row[1].name});
                })
                console.log(data);
                console.log(Math.round((max * 100) + 1));

                if (data.length > 0) {
                    data = completeTimelineOfChart(data, groups);
                    console.log(data);
                    // draw2DbarChart(data, groups, Math.round(Math.round((max*100)+5)));
                    draw2DLineChart(data, groups);
                }
                $("#vis").append('<h4 align="center"> The statistic reflects the rank of the keyword "' + $("#bWord").val() + '"</h4>');
            }
            else $("#vis").append('<h3>Sorry! But, no data found.</h3>');
            // else alert('Sorry! But, no data found. Please try another.');
        }
    })
    $("#barChart").modal("hide");
}

function getNKeywords() {
    resetDetailTable();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
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
                $(".topWordModal").append('<p>Sorry! But, no data found.</p>');
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
            else $(".topWordModal").append('<p>Sorry! But, no data found.</p>');
        }
    })
    $("#top10Keyword").modal("hide");
    $("#findTopWordModal").modal("show");

    //refresh
    $('#fPaperId').val('');
}

function getTimelineOfWord() {
    resetDetailTable();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
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
                $("#vis").append('<h3>Sorry! But, no data found.</h3>');
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
            else $("#vis").append('<h3>Sorry! But, no data found.</h3>');

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
    resetDetailTable();
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
        }
    });
    //get top words from neo4j
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (t:Timestamp)-[]-(topic:Topic)-[r:presents]-(keyword:KeyWord) where t.dateFormat=\"" + $("#chosenDate").find('option:selected').text() + "\" and topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" WITH keyword, r ORDER BY r.rank WITH keyword limit " + $("#keywordLimit").find('option:selected').text() + " MATCH (time:Timestamp)-[]-(topic:Topic)-[]-(keyword) where topic.name = \"" + $("#chosenTopicDropdown").find('option:selected').text() + "\" return keyword, time Order by keyword, time asc",
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
                $("#vis").append('<h3>Sorry! But, no data found.</h3>');
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
            else $("#vis").append('<h3>Sorry! But, no data found.</h3>');
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
    resetDetailTable();
    //get vectorTong và vectorPaper de tinh KMedoids
    var vectorTong = [];
    var vectorPapers = [];

    var startDate = new Date($("#startDay").find('option:selected').text());
    var number = parseInt($("#endDay").find('option:selected').text());
    var endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + number); //because of taking less than it
    console.log("MATCH (topic:Topic)-[]-(t:Timestamp) where t.dateFormat >= '" + changeToNeo4jFormatTime(startDate) + "' and t.dateFormat < '" + changeToNeo4jFormatTime(endDate) + "' with id(topic) as id, t MATCH (k:KeyWord)-[rel:presents]-(topic:Topic) where id(topic) = id with k, t MATCH (k)-[r:presents]-(p:Paper) return distinct k, t, r.weight ORDER BY r.weight DESC LIMIT 60");
    var start = changeToNeo4jFormatTime(startDate).split('-');
    var end = changeToNeo4jFormatTime(endDate).split('-');

    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
        }
    });

    //get all distinct Keywords of all Papers above.
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (topic:Topic)-[]-(t:Timestamp) where t.dateFormat >= '" + changeToNeo4jFormatTime(startDate) + "' and t.dateFormat < '" + changeToNeo4jFormatTime(endDate) + "' with id(topic) as id, t MATCH (k:KeyWord)-[rel:presents]-(topic:Topic) where id(topic) = id with k, t MATCH (k)-[r:presents]-(p:Paper) return distinct k, t, r.weight ORDER BY r.weight DESC LIMIT 60",
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
                console.log("Sorry! But, no data found.");
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
            // console.log(vectorTong);
        }
    });

    //get all Papers belonging to ? date
    $.ajax({
        type: "POST",
        url: "http://localhost:7474/db/data/transaction/commit",
        data: JSON.stringify({
            statements: [{
                statement: "MATCH (p:Paper)-[]-()-[]-(t:Timestamp) where t.dateFormat >= '" + changeToNeo4jFormatTime(startDate) + "' and t.dateFormat < '" + changeToNeo4jFormatTime(endDate) + "' with p MATCH (topic:Topic)-[]-(p)-[]-(k:KeyWord) return id(p), k, topic.name",
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
                console.log("Sorry! But, no data found.");
            }
            else if (res.results[0].data.length != 0) {
                var idPaper = 0;
                var vector = [];
                var topic = "";
                res.results[0].data.forEach(function (row) {
                    topic = row.row[2];
                    if (idPaper != 0 && idPaper != row.row[0]) {
                        vectorPapers.push(convert2VectorKMedoids(vectorTong, vector, idPaper, topic));
                        vector = [];
                    }
                    if (idPaper != row.row[0]) idPaper = row.row[0];
                    row.graph.nodes.forEach(function (n) {
                        if (existKeyword(vector, n.properties.value) == -1)
                            vector.push(n.properties.value);
                    })
                })
                vectorPapers.push(convert2VectorKMedoids(vectorTong, vector, idPaper, topic));
            }
            // console.log("vectorPapers");
            // console.log(vectorPapers);
            $.ajax({
                // traditional: true,
                type: "POST",
                url: "/clustering",
                data: {
                    clusteringArr: JSON.stringify(vectorPapers),
                    cluster: $("#numOfCluster").find('option:selected').text()
                },
                // contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    var json = $(data).find('#jsonRes').text();
                    var data = convertToD3LinkDataFormat(json, $("#numOfCluster").find('option:selected').text());
                    // $("#clusterModal").modal("show");
                    clustering(data);
                    $("#vis").append('<h4 align="center"> '+ $("#numOfCluster").find('option:selected').text() +' clusters of number of articles collected from 0 a.m ' + start[2] + '/' + start[1] + '/' + start[0]  + ' to 0 a.m ' + end[2] + '/' + end[1] + '/' + end[0] + '</h4>');
                },
                error: function (errMsg) {
                    alert("Sorry, but please try again !!!");
                }
            });
        }
    });

    $("#clustering").modal("hide");
}

function findTopKeywordsOfCluster(data) {
    //data =     [{"name": "18956", "rating": "0.1969418493", "group": "3"}];
    console.log(data);
    var keywordList = {};
    var groups = [];
    var group1 = [], group2 = [], group3 = [], group4 = [], group5 = [], group6 = [];
    var list1 = [], list2 = [], list3 = [], list4 = [], list5 = [], list6 = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row.group == "0")
            group1.push(row.name);
        else if (row.group == "1")
            group2.push(row.name);
        else if (row.group == "2")
            group3.push(row.name);
        else if (row.group == "3")
            group4.push(row.name);
        else if (row.group == "4")
            group5.push(row.name);
        else if (row.group == "5")
            group6.push(row.name);
    }
    groups.push(group1, group2, group3, group4, group5, group6);

    getKeywordsOfEachPaper(group1, getData);
    getKeywordsOfEachPaper(group2, getData);
    getKeywordsOfEachPaper(group3, getData);
    getKeywordsOfEachPaper(group4, getData);
    getKeywordsOfEachPaper(group5, getData);
    getKeywordsOfEachPaper(group6, getData);

    return (computeTermFrequency(listOfKeywords));
}

var listOfKeywords = [];
function getData(data) {
    listOfKeywords.push(data);
}

var getKeywordsOfEachPaper = function (listOfId, getData) {
    var keywordList = [];
    $.ajaxSetup({
        headers: {
            "Authorization": 'Basic ' + window.btoa(user + ":" + passwd)
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
        async: false,
        contentType: "application/json;charset=UTF-8",
        error: function (err) {
            console.log(err)
        },
        success: function (res) {
            var s;
            var keywords = [];
            var id = 0;
            if (res.results[0] == undefined) {
                console.log("Sorry! But, no data found.");
                return null;
            }
            else if (res.results[0].data.length != 0) {
                res.results[0].data.forEach(function (row) {
                    if (id != row.row[0] && id != 0) {
                        var temp = []
                        var obj = {};
                        // console.log(id + " has " + keywords.length + " words");
                        obj[id] = keywords;
                        temp.push(obj);
                        keywordList.push(temp);
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
            var temp = [];
            lastObj[id] = keywords;
            temp.push(lastObj);
            keywordList.push(temp);
            // console.log(JSON.stringify(keywordList));
            getData(keywordList);
        }
    })
}

var getDocs = function (dataJSON) {
    var docs = [];
    for (var i = 0; i < dataJSON.length; i++) {
        console.log("cluster");
        var cluster = dataJSON[i];
        for (var j = 0; j < cluster.length; j++) {
            var paper = cluster[j][0];
            docs.push(paper[Object.keys(paper)[0]]);
        }
    }
    // console.log("all docs");
    // console.log(docs);
    return docs;
}

function computeIDF(docs, term) {
    var count = 0;
    for (var i = 0; i < docs.length; i++) {
        var paper = docs[i];
        for (var j = 0; j < paper.length; j++) {
            if (term == Object.keys(paper[j]))
                count++;
        }
    }
    if (Math.log(docs.length / count) == Infinity) return 0;
    else return Math.log(docs.length / count);
}

function computeTFIDFeveryTerm(docs) {
    var top10Paper = [];
    for (var i = 0; i < docs.length; i++) {
        var termFrequency = [];
        var paper = docs[i];
        // console.log(paper);
        for (var j = 0; j < paper.length; j++) {
            var term = Object.keys(paper[j]).toString();

            var idf = computeIDF(docs, term);
            var tfIdf = parseFloat(paper[j][term]) * idf;
            termFrequency.push({term: term, frequency: tfIdf});
        }
        ;
        termFrequency.sort(function (a, b) {
            return b.frequency - a.frequency
        });
        var top10Split = termFrequency.slice(0, 10);
        top10Paper.push(convertTo10Score(top10Split));
    }
    // console.log(top10Paper);
    return top10Paper;
}

function convertTo10Score(top10key) {
    var top10 = {};
    for (var i = 0; i < top10key.length; i++) {
        top10[top10key[i].term] = (10 - i);
    }
    return top10;
}

var checkTermExists = function (a, term) {
    // var keys = Object.keys(a);
    for (var i = 0; i < a.length; i++) {
        if (a[i].term == term) return i;
    }
    return null;
}

function getTop20KeywordsForCluster(top10) {
    // var top10 = [{"cảnh_sát": 3, "thu_giữ": 2, "hiện_trường": 1, "gà_nhà": 3},{"hợp_pháp": 2, "cảnh_sát": 2, "hậu_trường": 1}, {"sinh_viên": 1, "cảnh_sát": 1, "hậu_trường": 3}];
    var accumulationList = [];
    for (var i = 0; i < top10.length; i++) {
        var row = top10[i];
        var keys = Object.keys(row);
        for (var j = 0; j < keys.length; j++) {
            var index = checkTermExists(accumulationList, keys[j]);
            if (index == null)
                accumulationList.push({term: keys[j], frequency: row[keys[j]]});
            else
                accumulationList[index].frequency = (row[keys[j]] + accumulationList[index].frequency);
        }
    }
    accumulationList.sort(function (a, b) {
        return b.frequency - a.frequency
    });
    var top20Split = accumulationList.slice(0, 20);
    console.log(top20Split);
    return top20Split;
}

function computeTermFrequency(dataJSON) {
    var j = 0;
    var temp = [];
    var result = [];
    for (var i = 0; i < dataJSON.length; i++) {
        // console.log("cluser " + i);
        temp[0] = dataJSON[i];
        var docs = getDocs(temp);
        var top10 = computeTFIDFeveryTerm(docs);
        result.push(getTop20KeywordsForCluster(top10));
    }
    return result;
}