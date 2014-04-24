/**
 * SPA-MVC utility class provides routing, view-model template processing
 *
 * View loader is able to load views run-time when requested for
 * the first time or pre-load them all on the initial startup
 *
 * To clear view cache use: mvc.viewsMap.clear();
 *
 * @constructor
 */
function SpaMvc()
{

    var contextLocation = "spa-mvc-context.json";
    $(document).ready(function(){
        $.ajax({
//            cache: false,
            url: contextLocation,
            type: "GET",
            success: function(data) {
                var viewsUrlMap = jQuery.makeArray(data.viewsUrlMap);
                var routeControllerMap = jQuery.makeArray(data.routeControllerMap);
                var startupController = jQuery.makeArray(data.startupController);
                var map, key, value;

                for (var i = 0; i < viewsUrlMap.length; i++) {
                    map = new HashTable(viewsUrlMap[i]);
                    key = map.keys()[0];
                    value = map.getItem(key);
                    mvc.viewsUrlMap.setItem(key, value);
                    console.log("viewsUrlMap: ["+key+"] = " + value);
                }

                for (var i = 0; i < routeControllerMap.length; i++) {
                    map = new HashTable(routeControllerMap[i]);
                    key = map.keys()[0];
                    value = map.getItem(key);
                    mvc.routeControllerMap.setItem(key, value);
                    var controller = window[value];
                    mvc.controllersMap.setItem(value, controller);
                    console.log("routeControllerMap: ["+key+"] = " + value +
                        " {controller found:"+ (controller!=undefined)+"}");
                }

                for (var i = 0; i < startupController.length; i++) {
                    mvc.controllersMap.getItem(startupController[i])();
                }

            },
            failure: function(data) {
                console.log("Failure loading context ["+contextLocation+"]: " + data);
            },
            error: function(data) {
                console.log("Error loading context ["+contextLocation+"]: " + data);
            }
        });
    });


    this.viewsUrlMap        = new HashTable({});
    this.viewsMap           = new HashTable({});
    this.controllersMap     = new HashTable({});
    this.routeControllerMap = new HashTable({});

    this.processView = function(viewName, model)
    {
        var startTime = new Date().getTime();
        var viewTemplate = mvc.viewsMap.getItem(viewName);
        if (viewTemplate == null || viewTemplate == undefined)
        {
            this.loadView(viewName);
            viewTemplate = mvc.viewsMap.getItem(viewName);
        }
        var template = Handlebars.compile(viewTemplate);
        console.log("Processing view ["+viewName+"] " + ((new Date().getTime())-startTime) + "ms");
        return template(model);
    }

    /**
     * Loads all available views
     */
    this.loadViews = function()
    {
        var keys = Object.keys(mvc.viewsUrlMap.items);
        for (var i = 0; i < keys.length; i++)
        {
            this.loadView(keys[i]);
        }
    };

    /**
     * Loads specified view
     * @param viewName
     */
    this.loadView = function(viewName)
    {
        var key = viewName;
        var viewUrl = this.viewsUrlMap.getItem(key);
        console.log("Loading view ["+key+"] from ["+viewUrl+"]");
        $.ajax({
            cache: false,
            url: viewUrl,
            type: "GET",
            success: function(data) {
                mvc.viewsMap.setItem(key, data);
                console.log("Loaded view ["+key+"] " + data.length + " bytes");
            },
            failure: function(data) {
                console.log("Failure loading view ["+key+"]: " + data);
            },
            error: function(data) {
                console.log("Error loading view ["+key+"]: " + data);
            },
            async: false // TODO...
        });
    };


    /**
     * Consumes URL hash calls and routs the action to appropriate controller
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


};
var mvc = new SpaMvc();



/**
 * IE console.log fix:
 * http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 */
if (!window.console) console = {log: function (s) {}};