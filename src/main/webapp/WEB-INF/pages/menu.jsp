<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 30-Jul-17
  Time: 12:56 PM
  To change this template use File | Settings | File Templates.
--%>
<div class="container mybar">
    <!-- Static navbar -->
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">News Graph</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse navbar-right">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="/">Home</a></li>
                    <li><a href="" data-toggle="modal" data-target="#infoCard">About</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                           aria-expanded="false">Tasks <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <%--<li><a href="#" data-toggle="modal" data-target="#showKeyword">Get keywords of paper</a></li>--%>
                            <li><a href="#" data-toggle="modal" data-target="#timelineWord">Show lifetime of a chosen
                                keyword</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#top10Keyword">Get N main keywords in a
                                paper</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#timelineTopic">Show lifetime of a chosen
                                topic</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#statisticsOfKeyword">Statistics of total
                                papers using a keyword</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#barChart">Statistics of keyword frequency through topics</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#clustering">Cluster articles to see the distribution of topics</a></li>
                            <li><a href="#" onclick="drawGraph()">Visualize news graph</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
        <!--/.container-fluid -->
    </nav>
</div>

<!-- Modal -->
<div id="top10Keyword" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Get N main keywords of paper</h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="top10KeywordForm" role="form">
                    <div class="form-group">
                        <label for="fPaperId" class="form-control-label">Enter paper's ID :</label>
                        <input type="text" class="form-control" id="fPaperId" name="fPaperId" required
                               data-fv-notempty-message="The paper's id is required">
                    </div>
                    <div class="form-group">
                        <label>Enter number of words :</label>
                        <select id = "fLimit">
                            <option value = "1">1</option>
                            <option value = "2">2</option>
                            <option value = "3">3</option>
                            <option value = "4">4</option>
                            <option value = "5">5</option>
                            <option value = "6">6</option>
                            <option value = "7">7</option>
                            <option value = "8">8</option>
                            <option value = "9">9</option>
                            <option value = "10">10</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-default btn-find fa fa-search"> Find</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="statisticsOfKeyword" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Investigate how many papers using this keyword</h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="statisticsOfKeywordForm">
                    <div class="form-group">
                        <label for="word" class="form-control-label">Enter a keyword :</label>
                        <input type="text" class="form-control" id="word" name="word">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-default btn-display fa fa-eye"> Show </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="barChart" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Investigate the usage of a keyword</h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="barChartForm">
                    <div class="form-group">
                        <label for="bWord" class="form-control-label">Enter a keyword :</label>
                        <input type="text" class="form-control" id="bWord" name="bWord">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-default btn-display fa fa-eye"> Show </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="timelineWord" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Show lifetime of a particular keyword</h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="timelineWordForm" accept-charset="ISO-8859-1">
                    <div class="form-group">
                        <label for="keyword" class="form-control-label">Which keyword you want to see? </label>
                        <input type="text" class="form-control" id="keyword" name="keyword">
                        <label for="topicDropdown" class="form-control-label">Which exact topic you want to
                            see? </label>
                        <select id="topicDropdown" style="width: 100%;">
                            <option>VNExpress-GiaoDuc</option>
                            <option>VNExpress-ThoiSu</option>
                            <option>VNExpress-KhoaHoc</option>
                            <option>VNExpress-PhapLuat</option>
                            <option>VNExpress-TheGioi</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default bt-close fa fa-times" data-dismiss="modal"> Close
                        </button>
                        <button type="submit" class="btn btn-default fa fa-eye" onclick="getTimelineOfWord()"> Show
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="timelineTopic" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Show timeline of all keywords in a topic</h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="timelineTopicForm" role="form">
                    <div class="form-group">
                        <label for="chosenTopicDropdown" class="form-control-label">Choose a topic you wanna
                            see: </label>
                        <select id="chosenTopicDropdown" style="width: 100%;">
                            <option>VNExpress-GiaoDuc</option>
                            <option>VNExpress-ThoiSu</option>
                            <option>VNExpress-KhoaHoc</option>
                            <option>VNExpress-PhapLuat</option>
                            <option>VNExpress-TheGioi</option>
                        </select>
                        <label>How many keywords you wanna see: </label>
                        <select id = "keywordLimit">
                            <option value = "1">1</option>
                            <option value = "2">2</option>
                            <option value = "3">3</option>
                            <option value = "4">4</option>
                            <option value = "5">5</option>
                            <option value = "6">6</option>
                            <option value = "7">7</option>
                            <option value = "8">8</option>
                            <option value = "9">9</option>
                            <option value = "10">10</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-default fa fa-eye" onclick="getTimelineOfTopic()"> Show
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- result Modal -->
<div id="findTopWordModal" class="modal fade" role="dialog" aria-hidden="true" tabindex="-1">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">The list of top keywords in paper</h4>
            </div>
            <div class="modal-body topWordModal">
            </div>
        </div>
    </div>
</div>

<!-- clustering result Modal -->
<div id="clusterModal" class="modal fade" role="dialog" aria-hidden="true" tabindex="-1">
    <div class="modal-dialog" style="width:550px; height:400px;">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">20 Top Keywords in a cluster</h4>
            </div>
            <div class="modal-body" id="clusteringModal">
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="clustering" class="modal fade" role="dialog">
    <div class="modal-dialog" style="width: 45%">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Clustering articles into 6 groups of topics </h4>
            </div>
            <div class="modal-body modalEdit">
                <form id="clusteringForm">
                    <div class="form-group">
                        <div class = "left col-md-5">
                        <label>From the day: </label>
                        <select id = "startDay">
                            <option value = "day1"> 28/09/2017 </option>
                        </select>
                        </div>
                        <div class = "left col-md-7">
                        <label>Select number of days to cluster: </label>
                        <select id = "endDay">
                            <option value = "1"> 1 </option>
                            <option value = "2"> 2 </option>
                            <option value = "3"> 3 </option>
                        </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-default btn-cluster fa fa-eye"> Show </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- ABout Modal -->
<div id="infoCard" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" style="color: red">&times;</button>
                <h4 class="modal-title fa fa-info-circle"> PROJECT INFORMATION</h4>
            </div>
            <div class="modal-body" style="text-align: center">
                <h5> CLUSTERING AND VISUALIZING THE TEXT STREAM OF DOCUMENTS
                    <br> USING TOPIC MODEL AND GRAPH DATABASE </h5>
                <p>Associate Professor: Do Phuc</p>
                <p style="padding-left: 10px">Student 1: Nguyen Dinh Phuong Trinh</p>
                <p>Student 2: Nguyen Huynh Anh Tuan</p>
            </div>
        </div>
    </div>
</div>
</div>
</div>
