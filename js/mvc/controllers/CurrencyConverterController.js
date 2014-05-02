var currencyConverterController = function(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".currencyConverterLeftMenuButton").parent().addClass("active");
    getCurrencyConverter(paramsArray[0] + paramsArray[1] + "=X", function(data){
        var model = {
            createTime: new Date(),
            fromCurrency: paramsArray[0],
            toCurrency: paramsArray[1],
            rate: data
        };
        var result = mvc.processView("CurrencyConverter", model);
        $(".main").html(result);
        $("#fromCurrency").val(model.fromCurrency);
        $("#toCurrency").val(model.toCurrency);
        $("#fromCurrency, #toCurrency").unbind("change").bind("change", function(e){
            mvc.routeCommand("currency-converter", [$("#fromCurrency").val(), $("#toCurrency").val()]);
        });
    });
}

function getCurrencyConverter(symbol, callBackFunction) {
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
        .done(function (data) {
            callBackFunction(data.query.results.quote.LastTradePriceOnly);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log('Request failed: ' + err);
        });
}