// Load all application specific MVC context in this script file
mvc.viewsUrlMap.setItem("LearnMore", "js/mvc/views/LearnMore.html");
mvc.viewsUrlMap.setItem("Overview", "js/mvc/views/Overview.html");
mvc.viewsUrlMap.setItem("Reports", "js/mvc/views/Reports.html");
mvc.viewsUrlMap.setItem("Index", "js/mvc/views/Index.html");

// Do not PreLoad all views "mvc.loadViews()" but instead cache/load them on the initial (first) use
mvc.routeControllerMap.setItem("learn-more", "learnMoreController");
mvc.routeControllerMap.setItem("overview", "overviewController");
mvc.routeControllerMap.setItem("reports", "reportsController");

mvc.controllersMap.setItem("learnMoreController", learnMoreController);
mvc.controllersMap.setItem("overviewController", overviewController);
mvc.controllersMap.setItem("reportsController", reportsController);



// Initial page controller binds the initial available choices
mvc.controllersMap.setItem("indexController", indexController);
mvc.routeControllerMap.setItem("index", "indexController");

$(document).ready(function(){
    mvc.controllersMap.getItem("indexController")();
});


// Register application specific Handlebars helpers
Handlebars.registerHelper('html', function(html) {
    return new Handlebars.SafeString(html);
});

// Create initial bindings



/**
 * Consumes URL hash calls and routs the action to appropriate functionality
 */
$(function(){
    $(window).hashchange( function(){
        var hash = location.hash;
        if (stringUtils.isNotBlank(hash))
        {
            hash = hash.substring(1);
            var params = hash.split("|");
            if (params.length > 0)
            {
                var routing = params[0];
                // TODO: Iterate through mvn routes to find controllers
                if (window.mvc != undefined)
                {
                    var keys = mvc.routeControllerMap.keys();
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i] == routing)
                        {
                            var controllerName = mvc.routeControllerMap.getItem(keys[i]);
                            var controller = mvc.controllersMap.getItem(controllerName);
                            params.shift(); // remove first element in array (routing param)
                            controller(params);
                        }
                    }
                }
            }
        }
    });
    $(window).hashchange();

});

