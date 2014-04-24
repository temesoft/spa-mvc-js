var reportsController = function ReportsController(paramsArray)
{
    var model = {someText: new Date()};
    var result = mvc.processView("Reports", model);
    $(".main").html(result);
}