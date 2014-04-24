var indexController = function IndexController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".indexLeftMenuButton").parent().addClass("active");
    var result = mvc.processView("Index", null);
    $(".main").html(result);


    $(".learnMoreButton").unbind("click").bind("click", function(e){
        document.location = "#learn-more";
    });

    $(".overviewLeftMenuButton").unbind("click").bind("click", function(e){
        document.location = "#overview";
    });

    $(".reportsLeftMenuButton").unbind("click").bind("click", function(e){
        document.location = "#reports";
    });

    $(".indexLeftMenuButton").unbind("click").bind("click", function(e){
        document.location = "#index";
    });
}