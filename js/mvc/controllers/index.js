var indexController = function IndexController(paramsArray)
{
    $(".nav-sidebar LI").removeClass("active");
    $(".indexLeftMenuButton").parent().addClass("active");
    var result = mvc.processView("Index", null);
    $(".main").html(result);
}

/**
 * Pre binds the main menu links for clicks
 */
var startupUiBindings = function StartupUiBindings()
{
    $(".learnMoreButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("learn-more", [1,2,new Date(),4,Math.floor(Math.random() * 1000000000),6,7,8,9,0]);
    });

    $(".currencyConverterLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("currency-converter", ["USD", "CAD"]);
    });

    $(".reportsLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("reports", Math.floor(Math.random() * 1000000000));
    });

    $(".indexLeftMenuButton").unbind("click").bind("click", function(e){
        mvc.routeCommand("index", []);
    });

    $("#urlEncryptionBtn").unbind("click").bind("click", function(e){
        var result = getCookie("urlEncryption", false);
        if (result == "false") {
            result = "true";
        }
        else
        {
            result = false;
        }
        createCookie("urlEncryption", result, 365);
        mvc.routeCommand("index", []);
    });
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name, defaultValue) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
        else
        {
            createCookie(c_name, defaultValue, 365);
        }
    }
    return defaultValue;
}