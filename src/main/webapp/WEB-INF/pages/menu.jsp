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
                            <li><a href="#" data-toggle="modal" data-target="#timelineTopic">Statistics of total papers
                                using a keyword</a></li>
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
                        <label for="fLimit" class="form-control-label">Enter number of words :</label>
                        <input type="text" class="form-control" id="fLimit" name="fLimit" required
                               data-fv-notempty-message="The number is required">
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
<%--<div id="showKeyword" class="modal fade" role="dialog">--%>
    <%--<div class="modal-dialog" style="width: 45%">--%>
        <%--<!-- Modal content-->--%>
        <%--<div class="modal-content">--%>
            <%--<div class="modal-header">--%>
                <%--<h4 class="modal-title">Find top-words of paper</h4>--%>
            <%--</div>--%>
            <%--<div class="modal-body modalEdit">--%>
                <%--<form id="showKeywordForm">--%>
                    <%--<div class="form-group">--%>
                        <%--<label for="paperid" class="form-control-label">Enter paper's ID :</label>--%>
                        <%--<input type="text" class="form-control" id="paperid" name="paperid">--%>
                    <%--</div>--%>
                    <%--<div class="modal-footer">--%>
                        <%--<button type="button" class="btn btn-default btn-close fa fa-times" data-dismiss="modal">--%>
                            <%--Close--%>
                        <%--</button>--%>
                        <%--<button type="submit" class="btn btn-default btn-show fa fa-eye"> Show</button>--%>
                    <%--</div>--%>
                <%--</form>--%>
            <%--</div>--%>
        <%--</div>--%>
    <%--</div>--%>
<%--</div>--%>

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
                        <label for="topicDropdown" class="form-control-label">Which exact topic you want to see? </label>
                        <select id="topicDropdown" style="width: 100%;" >
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
                        <label for="chosenTopicDropdown" class="form-control-label">Choose a topic you wanna see: </label>
                        <select id="chosenTopicDropdown" style="width: 100%;" >
                            <option>VNExpress-GiaoDuc</option>
                            <option>VNExpress-ThoiSu</option>
                            <option>VNExpress-KhoaHoc</option>
                            <option>VNExpress-PhapLuat</option>
                            <option>VNExpress-TheGioi</option>
                        </select>
                        <label for="limit" class="form-control-label">How many keywords you wanna see: </label>
                        <input type="text" class="form-control" id="limit" name="limit">
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
                <h4 class="modal-title">List of N top words in paper</h4>
            </div>
            <div class="modal-body topWordModal">
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

