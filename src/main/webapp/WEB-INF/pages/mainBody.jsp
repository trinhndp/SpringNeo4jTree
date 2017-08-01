<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 31-Jul-17
  Time: 3:35 PM
  To change this template use File | Settings | File Templates.
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@page isELIgnored="false" %>
<%@taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<html>
<head>
    <link rel="stylesheet" href="/resources/css/mainBody.css"/>   <!-- placed after bootstrap to override -->
    <!-- Required scripts -->
    <script src="/resources/js/vis.min.js"></script>
    <script src="/resources/js/drawTree.js"></script>
</head>
<body>
<div class="mainContainer">
    <div class="leftColumn">
        <div class="title">
            <p><span class="glyphicon glyphicon-picture"></span> Visualization</p>
        </div>
        <div id="vis" class="rightBoxContent"></div>
    </div>
    <div class="rightColumn">
        <div class="title">
            <p><span class="glyphicon glyphicon-info-sign"></span> Information</p>
        </div>

        <div class="leftBoxContent" id="info">
            <div class="container info-table">
                <div class="row">
                    <h2>Node's Details</h2>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Label</th>
                            <th>Content</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td id="key"></td>
                            <td id="content"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>

</body>
</html>