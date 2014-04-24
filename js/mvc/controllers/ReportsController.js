var reportsController = function ReportsController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".reportsLeftMenuButton").parent().addClass("active");
    var model = {someText: new Date()};
    var result = mvc.processView("Reports", model);
    $(".main").html(result);
}