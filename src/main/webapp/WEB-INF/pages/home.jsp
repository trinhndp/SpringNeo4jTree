<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 29-Jul-17
  Time: 3:03 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>News Graph</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="/resources/css/vis.min.css"/>
    <link rel="stylesheet" href="/resources/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="/resources/css/home.css"/> <!-- placed after bootstrap to override -->
    <link rel="stylesheet" href="/resources/css/menu.css"/>
    <link rel="stylesheet" href="/resources/css/mainBody.css"/>   <!-- placed after bootstrap to override -->
    <link rel="stylesheet" href="/resources/css/footer.css"/>

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Required scripts -->
    <script src="/resources/js/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/bootstrap.min.js"></script>
    <!-- Required scripts -->
    <script src="/resources/js/vis.min.js"></script>
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="/resources/js/homeScript.js"></script>
    <script src="/resources/js/drawTree.js"></script>
    <script src="/resources/js/cloud.js"></script>
    <script src="/resources/js/wordCloud.js"></script>
    <%@ include file = "menu.jsp" %>
</head>
<body>

<%@ include file = "mainBody.jsp" %>
<%@ include file = "footer.jsp" %>
</body>
</html>
