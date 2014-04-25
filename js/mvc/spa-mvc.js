/**
 * SPA-MVC utility class provides routing, view-model template processing
 *
 * View loader is able to load views run-time when requested for
 * the first time or pre-load them all on the initial startup
 *
 * To clear view cache use: mvc.viewsMap.clear();
 *
 * Options include: sessionId, encryptHashParams
 *
 * @constructor
 */
function SpaMvc(options)
{
    debug("Starting SpaMvc.");
    this.sessionId          = "pass-session-id-as-options-param";
    this.encryptHashParams  = true;

    if (stringUtils.isNotUndAndNull(options))
    {
        if (options['sessionId'] != null) // stringify since might be a boolean or something
        {
            this.sessionId = options['sessionId'];
        }
        if (options['encryptHashParams'] != null)
        {
            this.encryptHashParams = options['encryptHashParams'];
        }
    }

    this.viewsUrlMap        = new HashTable({});
    this.viewsMap           = new HashTable({});
    this.controllersMap     = new HashTable({});
    this.routeControllerMap = new HashTable({});

    /**
     * Processes the view template with model using handlebars
     * @param viewName
     * @param model
     */
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
        debug("Processing view ["+viewName+"] " + ((new Date().getTime())-startTime) + "ms");
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
        debug("Loading mvc.loadView("+key+") from ["+viewUrl+"]");
        $.ajax({
            cache: false,
            url: viewUrl,
            type: "GET",
            success: function(data) {
                mvc.viewsMap.setItem(key, data);
                debug("mvc.loadView("+key+") " + data.length + " bytes");
            },
            failure: function(data) {
                debug("Failure loading mvc.loadView("+key+") " + data);
            },
            error: function(data) {
                debug("Error loading mvc.loadView("+key+") " + data);
            },
            async: false
        });
    };


    /**
     * Consumes URL hash calls and routs / dispatches the action to appropriate controller
     */
    this.processHash = function(hash)
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
                        if (this.encryptHashParams)
                        {
                            var decParamStr = CryptoJS.AES.decrypt(params[0], mvc.sessionId);
                            controller(decParamStr.toString(CryptoJS.enc.Utf8).split("|"));
                        }
                        else
                        {
                            controller(params);
                        }

                    }
                }
            }
        }
    }

    /**
     * Routes / dispatches the hash command + params string
     * @param command
     * @param paramArray
     */
    this.routeCommand = function(command, paramArray)
    {
        var encRoute = "#" + command + "|";
        if (this.encryptHashParams)
        {
            encRoute = encRoute + CryptoJS.AES.encrypt(jQuery.makeArray(paramArray).join("|"), mvc.sessionId).toString();
        }
        else
        {
            encRoute = encRoute + jQuery.makeArray(paramArray).join("|");
        }

        document.location = encRoute;
    }

    this.loadSpaMvcContext = function(jsonConfigFiles)
    {
        var jsonConfigFilesArray = jQuery.makeArray(jsonConfigFiles);
        for (var i = 0; i < jsonConfigFilesArray.length; i++)
        {
            var jsonConfigFile = jsonConfigFilesArray[i];
            $.ajax({
                url: jsonConfigFile,
                type: "GET",
                async: false,
                success: function(data) {

                    var viewsUrlMap = jQuery.makeArray(data.viewsUrlMap);
                    var routeControllerMap = jQuery.makeArray(data.routeControllerMap);
                    var startupController = jQuery.makeArray(data.startupController);
                    var startupUiBindings = jQuery.makeArray(data.startupUiBindings);
                    var map, key, value;

                    for (var i = 0; i < viewsUrlMap.length; i++) {
                        map = new HashTable(viewsUrlMap[i]);
                        key = map.keys()[0];
                        value = map.getItem(key);
                        mvc.viewsUrlMap.setItem(key, value);
//            debug("viewsUrlMap: ["+key+"] = " + value);
                    }

                    for (var i = 0; i < routeControllerMap.length; i++) {
                        map = new HashTable(routeControllerMap[i]);
                        key = map.keys()[0];
                        value = map.getItem(key);
                        mvc.routeControllerMap.setItem(key, value);
                        var controller = window[value];
                        mvc.controllersMap.setItem(value, controller);
//            debug("routeControllerMap: ["+key+"] = " + value + " {controller found:"+ (controller!=undefined)+"}");
                    }

                    for (var i = 0; i < startupController.length; i++) {
                        mvc.controllersMap.getItem(startupController[i])();
                    }

                    for (var i = 0; i < startupUiBindings.length; i++) {
                        mvc.controllersMap.getItem(startupUiBindings[i])();
                    }

                    // If there is hash command - process through regular mvc route dispatcher
                    if (location.hash.indexOf("#") == 0)
                    {
                        var hash = location.hash;
                        if (stringUtils.isNotBlank(hash))
                        {
                            mvc.processHash(hash);
                        }
                    }
                },
                failure: function(data) {
                    debug("Failure loading context ["+contextLocation+"]: " + data);
                },
                error: function(data) {
                    debug("Error loading context ["+contextLocation+"]: " + data);
                }
            });
        }
    }

    // Routing / dispatching mvc module
    $(function(){
        $(window).hashchange( function(){
            var hash = location.hash;
            if (stringUtils.isNotBlank(hash))
            {
                mvc.processHash(hash);
            }
        });
        $(window).hashchange();
    });

};
/**
 * IE console.log fix:
 * http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 */
if (!window.console) console = {log: function (s) {}};

function debug(log)
{
    console.log(new Date() + " {"+new Date().getTime()+"} - " + log);
}




