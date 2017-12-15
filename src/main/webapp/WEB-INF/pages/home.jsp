<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 29-Jul-17
  Time: 3:03 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<html>
<head>
    <title>News Graph</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="/resources/css/framework/vis.min.css"/>
    <link rel="stylesheet" href="/resources/css/framework/bootstrap.min.css"/>
    <link rel="stylesheet" href="/resources/css/home.css"/> <!-- placed after bootstrap to override -->
    <link rel="stylesheet" href="/resources/css/menu.css"/>
    <link rel="stylesheet" href="/resources/css/mainBody.css"/>   <!-- placed after bootstrap to override -->
    <link rel="stylesheet" href="/resources/css/footer.css"/>
    <link rel="stylesheet" href="/resources/css/barChart.css"/>

    <link rel="stylesheet" href="/resources/css/font-awesome.min.css">
    <!-- Required scripts -->
    <script src="/resources/js/framework/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/framework/d3.v3.min.js"></script>
    <script src="/resources/js/framework/bootstrap.min.js"></script>
    <script src="/resources/js/framework/vis.min.js"></script>
    <script src="/resources/js/validation/jquery.validation.js"></script>
    <!-- Required scripts -->
    <script src="/resources/js/homeScript.js"></script>
    <script src="/resources/js/helper.js"></script>
    <script src="/resources/js/drawTimeline.js"></script>
    <script src="/resources/js/drawTree.js"></script>
    <script src="/resources/js/draw2DLineChart.js"></script>
    <script src="/resources/js/draw2DBarChart.js"></script>
    <script src="/resources/js/drawClustering.js"></script>
    <%@ include file = "menu.jsp" %>
</head>
<body>
<%@ include file = "mainBody.jsp" %>
<%@ include file = "footer.jsp" %>
</body>
</html>
