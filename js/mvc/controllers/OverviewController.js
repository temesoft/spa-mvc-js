var overviewController = function OverviewController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".overviewLeftMenuButton").parent().addClass("active");
    var model = {createTime: new Date(), paramsArray: paramsArray};
    var result = mvc.processView("Overview", model);
    $(".main").html(result);
}