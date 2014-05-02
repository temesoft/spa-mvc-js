var learnMoreController = function(paramsArray)
{
    $(".nav-sidebar LI.active").removeClass("active");
    $(".learnMoreButton").parent().addClass("active");
    var model = {createTime: new Date(), paramsArray: paramsArray};
    var result = mvc.processView("LearnMore", model);
    $(".main").html(result);
}