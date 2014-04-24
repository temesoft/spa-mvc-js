var reportsController = function ReportsController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".reportsLeftMenuButton").parent().addClass("active");
    var model = {createTime: new Date(), paramsArray: paramsArray};
    var result = mvc.processView("Reports", model);
    $(".main").html(result);
}