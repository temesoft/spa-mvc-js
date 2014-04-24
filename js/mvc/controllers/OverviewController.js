var overviewController = function OverviewController(paramsArray)
{
    var model = {someText: new Date()};
    var result = mvc.processView("Overview", model);
    $(".main").html(result);
}