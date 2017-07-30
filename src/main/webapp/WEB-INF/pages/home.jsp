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
    <%--<link rel="stylesheet" href="/resources/css/bootstrap.min.css"/>--%>
    <link rel="stylesheet" href="/resources/css/home.css"/> <!-- placed after bootstrap to override -->
    <!-- Required scripts -->
    <script src="/resources/js/jquery-3.2.1.min.js"></script>
    <%--<script src="/resources/js/bootstrap.min.js"></script>--%>
    <script src="/resources/js/vis.min.js"></script>
    <%--<script src="/resources/js/drawTree.js"></script>--%>
</head>
<body>
<%@ include file = "menu.jsp" %>
<div class="mainContainer">
    <div class="leftColumn">
        <h2>Left Column (fluid)</h2>

        <p>Bacon ipsum dolor sit amet capicola ball tip beef ribs leberkas, turkey biltong salami shoulder ribeye. Leberkas chuck cow andouille kevin ribeye pork strip steak pork chop beef ribs beef ball tip corned beef. Leberkas prosciutto brisket, short ribs salami cow sirloin chicken. Bacon pork belly bresaola tenderloin biltong leberkas. Strip steak beef leberkas sirloin, venison turkey hamburger kevin. Drumstick chicken ground round t-bone flank fatback jerky ball tip. Jerky ribeye sirloin t-bone.</p>

        <p>Tongue prosciutto pork ball tip ham hock, meatball sirloin brisket kielbasa biltong doner shoulder bresaola. Chuck beef ribs biltong, kielbasa ground round swine andouille corned beef. Venison hamburger tongue shank. Leberkas doner pork chop sausage kielbasa pancetta, biltong brisket pastrami tenderloin boudin filet mignon sirloin cow meatloaf. Ham ball tip bacon pork belly sirloin.</p>

        <p>Shoulder pig short ribs, salami chicken venison bresaola. Frankfurter meatball pork chop pork loin, turkey strip steak kielbasa pork belly drumstick shank prosciutto. Pork chicken ground round, sirloin tri-tip ham hock pork chop cow meatloaf pork loin bresaola turkey. Prosciutto hamburger pork short ribs flank tri-tip chicken pig bacon meatloaf t-bone shankle doner. Bresaola doner spare ribs biltong jowl boudin, tri-tip pork leberkas ham hock filet mignon.</p>

        <p>Leberkas strip steak shoulder meatball, flank biltong shank fatback ball tip swine prosciutto hamburger. Jerky frankfurter drumstick, ham ham hock hamburger kevin kielbasa salami chuck. Flank rump beef cow, beef ribs meatball ball tip jowl bacon pork chop. Biltong tongue pork chop hamburger. Frankfurter tri-tip pancetta pork chop venison t-bone andouille beef ribs salami boudin meatball doner spare ribs. Brisket pork chop pig kielbasa jerky chuck pork belly beef meatball boudin short loin. Doner jerky andouille ham meatloaf prosciutto kevin pork belly short loin pancetta.</p>

        <p>Corned beef spare ribs hamburger pork tenderloin flank pork loin beef ribs sausage brisket chicken venison bacon short loin sirloin. Ribeye tail short ribs andouille kevin chicken shankle meatloaf, corned beef rump sirloin t-bone chuck tongue. Swine venison tongue, sirloin turducken drumstick bresaola strip steak rump. Kevin ham hock meatball tri-tip. Ground round leberkas pig beef salami strip steak meatball beef ribs. Chicken ball tip rump, short loin bresaola pork t-bone jerky jowl pork chop tail chuck sausage prosciutto.</p>
    </div>
    <div class="rightColumn">
        <h2>Right Column</h2>

        <p>Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby. The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.</p>
    </div>
</div>

</body>
</html>
