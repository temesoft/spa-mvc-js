var learnMoreController = function LearnMoreController(paramsArray)
{
    $(".nav-sidebar LI.active").removeClass("active");
    $(".learnMoreButton").parent().addClass("active");
    var model = {someText: "Maybe some RESTfully received data: " + new Date()};
    var result = mvc.processView("LearnMore", model);
    $(".main").html(result);
}