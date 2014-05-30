/**
 * Pre binds the main menu links for clicks also some functionality
 * for the url encryption toggle (cookie driven)
 */

var startupController = function(){

    indexController(null);

    $(document).on("click", ".learnMoreButton", function(e) {
        mvc.routeCommand("learn-more", [1,2,new Date(),4,Math.floor(Math.random() * 1000000000),6,7,8,9,0]);
    });

    $(document).on("click", ".currencyConverterLeftMenuButton", function(e) {
        mvc.routeCommand("currency-converter", ["USD", "CAD"]);
    });

    $(document).on("click", ".reportsLeftMenuButton", function(e) {
        mvc.routeCommand("reports", Math.floor(Math.random() * 1000000000));
    });
    $(document).on("click", ".indexLeftMenuButton", function(e) {
        mvc.routeCommand("index", []);
    });
    $(document).on("click", "#urlEncryptionBtn", function(e) {
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
};

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