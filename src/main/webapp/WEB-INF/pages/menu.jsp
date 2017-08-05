<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 30-Jul-17
  Time: 12:56 PM
  To change this template use File | Settings | File Templates.
--%>
<%--<%@ page contentType="text/html;charset=UTF-8" language="java" %>--%>
    <%--<title>Title</title>--%>
    <%--<meta name="viewport" content="width=device-width, initial-scale=1">--%>
    <%--<link rel="stylesheet" href="/resources/css/bootstrap.min.css"/>--%>
    <%--<link rel="stylesheet" href="/resources/css/menu.css"/>   <!-- placed after bootstrap to override -->--%>

    <%--<!-- Required scripts -->--%>
    <%--<script src="/resources/js/jquery-3.2.1.min.js"></script>--%>
    <%--<script src="/resources/js/bootstrap.min.js"></script>--%>
    <%--<script src="/resources/js/homeScript.js"></script>--%>

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
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">News Graph</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse navbar-right">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                           aria-expanded="false">Tasks <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Display whole graph</a></li>
                            <li><a href="/myModal" data-toggle="modal" data-target="#myModal">Find papers by topic </a></li>
                            <li><a href="#">Something else here</a></li>
                            <li role="separator" class="divider"></li>
                            <li class="dropdown-header">Search</li>
                            <li><a href="#">Search paper by title</a></li>
                            <li><a href="#">Search topic</a></li>
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
<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Find papers by topic</h4>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="recipient-name" class="form-control-label">Enter topic :</label>
                        <input type="text" class="form-control" id="recipient-name">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-default">Get All</button>
            </div>
        </div>
    </div>
</div>