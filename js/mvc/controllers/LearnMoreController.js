var learnMoreController = function LearnMoreController(paramsArray)
{
    var model = {someText: "Maybe some RESTfully received data: " + new Date()};
    var result = mvc.processView("LearnMore", model);
    $(".main").html(result);
}