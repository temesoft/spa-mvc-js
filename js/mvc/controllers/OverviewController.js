var overviewController = function OverviewController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".overviewLeftMenuButton").parent().addClass("active");
    var model = {someText: new Date()};
    var result = mvc.processView("Overview", model);
    $(".main").html(result);
}