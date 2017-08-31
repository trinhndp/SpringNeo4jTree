/**
 * Created by Bean on 30-Jul-17.
 */
$(document).ready(function () {
    $('.topWord').css("display", "none");

    $('.nav li').click(function (e) {
        $('.nav li').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        //e.preventDefault();
    });

    $('.btn-find').click(function (e) {
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
                    statement: "MATCH (p:Paper) WHERE id(p) =" + $('#paper-id').val() + " MATCH s=(w:KeyWord)-[r]->(p) return s ORDER BY r.weight DESC LIMIT 10",
                    resultDataContents: ["row", "graph"]
                }]
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            error: function (err) {
                console.log(err)
            },
            success: function (res) {
                var sample = [];
                var order = 1;
                //remove old content
                $("#chart-div").empty();
                if(res.results[0].data.length==0) {
                    $("#chart-div").append('<p>Data not found.</p>');
                    $(".response-modal").removeAttr("height");
                    $(".response-modal").css("height", "110px");
                }
                else res.results[0].data.forEach(function (row) {
                    var value = [], probability = [];
                    row.graph.nodes.forEach(function (n) {
                        if(n.properties.value) {
                        value = n.properties.value;
                        }
                    })

                    row.graph.relationships.map(function (r) {
                        probability = r.properties.weight;
                    });
                    sample.push({id: order, name: value, prob: (probability*100).toFixed(2)});
                    order++;
                })
                drawHBarChart('#chart-div', sample);
                $("#top10Keyword").modal("hide");
                $("#findTopWordModal").modal("show");
            }
        });
    });

    $('.btn-show').click(function (e) {
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
                    statement: "MATCH (p:Paper) WHERE id(p) =" + $('#paperid').val() + " MATCH s=(w:KeyWord)-[r]->(p) return s ORDER BY r.weight",
                    resultDataContents: ["row", "graph"]
                }]
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            error: function (err) {
                console.log(err)
            },
            success: function (res) {
                $("#vis").empty();
                var word_count = {}, value, probability;
                console.log("length " + res.results[0].data.length);
                if(res.results[0].data.length == 0) {
                    $("#vis").append('<h3>Data not found.</h3>');
                }
                else res.results[0].data.forEach(function (row) {
                    row.graph.nodes.forEach(function (n) {
                        if(n.properties.value) {
                            value = n.properties.value;
                        }
                    })

                    row.graph.relationships.map(function (r) {
                        probability = r.properties.weight;
                    });
                    word_count[value] = (probability*100).toFixed(2);
                })
                drawWordCloud(word_count);
                $("#showKeyword").modal("hide");
            }
        });
    });
});

function drawHBarChart(target, data, params) {
        var $target = $(target);
        if ($target.length === 0) {
            return;
        }

        // default params
        var p = {
            containerClassName: 'bs-bar-chart',  // detect if the container already init.
                                                 // override if you need another class name
            initAnimation: true,
            max: 0,
            xInc: 3,
            labelWidth: 3,                  // bootstrap grid col width (i.e. 3/12)
            rgbaFrom: [66, 139, 202, 1],    // ignore if colors is not null
            rgbaTo: [215, 230, 244, 1],     // ignore if colors is not null
            colors: null
        };

        // set input params
        for (var k in params) {
            p[k] = params[k];
        }

        var firstTime = !$target.hasClass(p.containerClassName);
        $target.addClass(p.containerClassName);

        // sort the data and remove extra items
        data = data.sort(function(a, b) {
            return a.prob==b.prob?(b.name<a.name?-1:1):(b.prob-a.prob);
        });
        var maxProb = 0;
        var currXMax = $target.data('xaxis-max') || 0;
        for (var i=0 ; i<data.length ; i++) {
            maxProb = Math.max(maxProb, data[i].prob);
        }
        if (maxProb > currXMax) {
            currXMax = (maxProb + p.xInc) * 1.0;
            $target.data('xaxis-max', currXMax);
        }
        for (var i=0 ; i<data.length ; i++) {
            var d = data[i];
            var name = d.name;
            var pct = d.prob * 100 / currXMax;
            var color;
            if (p.colors) {
                color = p.colors[i % p.colors.length];
            }
            else {
                color = 'rgba(' +
                    Math.round((p.rgbaFrom[0]+(p.rgbaFrom[0]>p.rgbaTo[0]?-1:1)*Math.abs(p.rgbaTo[0]-p.rgbaFrom[0])/(Math.max(p.max,data.length)-1)*i)) + ',' +
                    Math.round((p.rgbaFrom[1]+(p.rgbaFrom[1]>p.rgbaTo[1]?-1:1)*Math.abs(p.rgbaTo[1]-p.rgbaFrom[1])/(Math.max(p.max,data.length)-1)*i)) + ',' +
                    Math.round((p.rgbaFrom[2]+(p.rgbaFrom[2]>p.rgbaTo[2]?-1:1)*Math.abs(p.rgbaTo[2]-p.rgbaFrom[2])/(Math.max(p.max,data.length)-1)*i)) + ',' +
                    (p.rgbaFrom[3]+(p.rgbaFrom[3]>p.rgbaTo[3]?-1:1)*Math.abs(p.rgbaTo[3]-p.rgbaFrom[3])/(Math.max(p.max,data.length)-1)*i) + ')';
            }
            var $bar = $target.find('> div:nth-child(' + (i+1) + ')');
            if (firstTime || $bar.length === 0) {
                var $newbar = $('<div class="row" data-item-id="' + d.id +
                    '" style="margin-top:3px;"><div class="col-sm-' + p.labelWidth + ' chart-name">' + name +
                    '</div><div class="col-sm-' + (12 - p.labelWidth) + '"><div class="progress-bar"' +
                    ' data-percentage="' + pct + '" style="background-color:' + color +
                    ';width:' + (firstTime && p.initAnimation?0:pct) + '%;">&nbsp;</div></div></div>');
                $target.append($newbar);
                if (!firstTime) {
                    $newbar.hide().fadeIn();
                }
            }
            else {
                $bar.find('.progress-bar').css({ 'width': pct+'%' });
                if ($bar.attr('data-item-id') != d.id) {
                    $bar.attr('data-item-id', d.id).find('.chart-name').attr('data-anim-name', name).fadeOut(function() {
                        $(this).html($(this).attr('data-anim-name')).removeAttr('data-anim-name').fadeIn();
                    });
                }
            }
        }
        if (firstTime && p.initAnimation) {
            // animate
            window.setTimeout(function() {
                $target.find('.progress-bar').each(function() {
                    $(this).css({'width':$(this).data('percentage') + '%'});
                });
            }, 0);
        }
    }

function redirect(){}