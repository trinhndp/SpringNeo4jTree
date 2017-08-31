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
                            <li><a href="#" onclick="drawGraph()">Visualize news graph</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#showKeyword">Get keywords of paper</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#top10Keyword">Get top-10 hot keywords of the paper</a></li>
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
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Find top-words of paper</h4>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="paper-id" class="form-control-label">Enter paper ID :</label>
                        <input type="text" class="form-control" id="paper-id">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default fa fa-times" data-dismiss="modal"> Close</button>
                <button type="submit" class="btn btn-default btn-find fa fa-search"> Find</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="showKeyword" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Find top-words of paper</h4>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="paperid" class="form-control-label">Enter paper ID :</label>
                        <input type="text" class="form-control" id="paperid">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default fa fa-times" data-dismiss="modal"> Close</button>
                <button type="submit" class="btn btn-default btn-show fa fa-eye"> Show</button>
            </div>
        </div>
    </div>
</div>

<!-- result Modal -->
<div id="findTopWordModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content response-modal">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">List of top words in paper</h4>
            </div>
            <div class="modal-body" >
                <div id="chart-div" style="height: 25px; width: 100%;"></div>
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
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title fa fa-info-circle"> PROJECT INFORMATION</h4>
            </div>
            <div class="modal-body" >
                        <h5> CLUSTERING AND VISUALIZING THE TEXT STREAM OF DOCUMENTS
                            <br> USING TOPIC MODEL AND GRAPH DATABASE </h5>
                        <p>Professor: Do Phuc</p>
                        <p>Student 1: Nguyen Dinh Phuong Trinh</p>
                        <p>Student 2: Nguyen Huynh Anh Tuan</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

