<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: Bean
  Date: 31-Jul-17
  Time: 3:35 PM
  To change this template use File | Settings | File Templates.
--%>
<%--<%@page contentType="text/html;charset=UTF-8" language="java" %>--%>
<%--<%@page isELIgnored="false" %>--%>
<%--<%@taglib prefix="s" uri="http://www.springframework.org/tags"%>--%>
<%--<%@taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>--%>
<%--<%@ taglib prefix = "fn"--%>
<%--uri = "http://java.sun.com/jsp/jstl/functions" %>--%>
<div class="mainContainer">
    <div class="leftColumn">
        <div class="title">
            <p><span class="glyphicon glyphicon-picture"></span> Visualization</p>
        </div>
        <div id="vis" class="leftboxContent scroll"></div>
    </div>
    <div class="rightColumn">
        <div class="title">
            <p><span class="glyphicon glyphicon-info-sign"></span> Information</p>
        </div>

        <div class="rightBoxContent" id="info">
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
            <div class="container detail-table">
                <h2>Paper's Details</h2>
                <div class="row scroll">
                    <p id="id">${id}</p>
                    <p id="titleFile">${titleFile}</p>
                    <p id="intro">${intro}</p>
                    <p id="contentFile">${contentFile}</p>
                    <p id="url">${url}</p>
                </div>
            </div>
        </div>

    </div>
</div>

<%--</body>--%>
<%--</html>--%>