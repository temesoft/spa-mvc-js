var indexController = function IndexController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".indexLeftMenuButton").parent().addClass("active");
    var result = mvc.processView("Index", null);
    $(".main").html(result);


    $(".learnMoreButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("learn-more", [1,2,new Date(),4,Math.floor(Math.random() * 1000000000),6,7,8,9,0]);
    });

    $(".overviewLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("overview", [1,2,new Date(),4,Math.floor(Math.random() * 1000000000),6,7,8,9,0]);
    });

    $(".reportsLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("reports", Math.floor(Math.random() * 1000000000));
    });

    $(".indexLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("index", []);
    });
}