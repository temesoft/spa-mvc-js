var indexController = function(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".indexLeftMenuButton").parent().addClass("active");
    var result = mvc.processView("Index", {version: mvc.version, createTime: new Date(), createTimeMs: new Date().getTime()});
    $(".main").html(result);
}