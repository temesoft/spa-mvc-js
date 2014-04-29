/**
 * SPA-MVC utility class provides Routing, view-model template processing
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
    if (stringUtils.isNotUndAndNull(options))
    {

        this.context            = "spa-mvc-context.json";
        this.sessionId          = "pass-session-id-as-options-param";
        this.encryptHashParams  = true;
        this.debugOn            = false;
        this.preloadViews       = false;
        this.timestamp          = function(){ return (new Date())+"> " };

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
            if (options['debugOn'] != null)
            {
                this.debugOn = options['debugOn'];
            }
            if (options['context'] != null)
            {
                this.context = options['context'];
            }
            if (options['preloadViews'] != null)
            {
                this.preloadViews = options['preloadViews'];
            }
        }

        if (this.debugOn)
            console.log(this.timestamp() + "Starting spa-mvc-js framework. ");

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
            if (this.debugOn)
                console.log(this.timestamp() + "Processing view ["+viewName+"] " + ((new Date().getTime())-startTime) + "ms");
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
            if (this.debugOn)
                console.log(this.timestamp() + "Loading mvc.loadView("+key+") from ["+viewUrl+"]");
            $.ajax({
                cache: false,
                url: viewUrl,
                type: "GET",
                success: function(data) {
                    mvc.viewsMap.setItem(key, data);
                    if (this.debugOn)
                        console.log(this.timestamp() + "mvc.loadView("+key+") " + data.length + " bytes");
                },
                failure: function(data) {
                    if (this.debugOn)
                        console.log(this.timestamp() + "Failure loading mvc.loadView("+key+") " + data);
                },
                error: function(data) {
                    if (this.debugOn)
                        console.log(this.timestamp() + "Error loading mvc.loadView("+key+") " + data);
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
                            if (this.encryptHashParams && params.length > 0)
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
            var encRoute = "#" + command;
            var arrayParams = jQuery.makeArray(paramArray);
            if (arrayParams.length > 0)
            {
                if (this.encryptHashParams)
                {
                    encRoute = encRoute + "|" + CryptoJS.AES.encrypt(arrayParams.join("|"), mvc.sessionId).toString();
                }
                else
                {
                    encRoute = encRoute + "|" + jQuery.makeArray(paramArray).join("|");
                }
            }
            document.location = encRoute;
        }

        /**
         * Loads the context from json files remotely async
         */
        this.loadSpaMvcContext = function()
        {
            var jsonConfigFilesArray = jQuery.makeArray(this.context);
            for (var i = 0; i < jsonConfigFilesArray.length; i++)
            {
                var jsonConfigFile = jsonConfigFilesArray[i];
                var mvcThis = this;
                $.ajax({
                    url: jsonConfigFile,
                    type: "GET",
                    async: false,
                    success: function(data) {
                        var viewsUrlMap = jQuery.makeArray(data.viewsUrlMap);
                        var routeControllerMap = jQuery.makeArray(data.routeControllerMap);
                        var startupController = jQuery.makeArray(data.startupController);
                        var map, key, value;

                        for (var i = 0; i < viewsUrlMap.length; i++) {
                            map = new HashTable(viewsUrlMap[i]);
                            key = map.keys()[0];
                            value = map.getItem(key);
                            if (this.debugOn)
                                console.log(this.timestamp() + "viewsUrlMap: ["+key+"] = " + value);
                            mvcThis.viewsUrlMap.setItem(key, value);
                        }

                        for (var i = 0; i < routeControllerMap.length; i++) {
                            map = new HashTable(routeControllerMap[i]);
                            key = map.keys()[0];
                            value = map.getItem(key);
                            if (this.debugOn)
                                console.log(this.timestamp() + "routeControllerMap: ["+key+"] = " + value + " {controller found:"+ (controller!=undefined)+"}");
                            mvcThis.routeControllerMap.setItem(key, value);
                            var controller = window[value];
                            mvcThis.controllersMap.setItem(value, controller);
                        }

                        for (var i = 0; i < startupController.length; i++) {
                            if (this.debugOn)
                                console.log(this.timestamp() + "executing startup controller: ["+startupController[i]+"]");
                            mvcThis.controllersMap.getItem(startupController[i])();
                        }

                        // If there is hash command - process through regular mvc route dispatcher
                        if (location.hash.indexOf("#") == 0)
                        {
                            var hash = location.hash;
                            if (stringUtils.isNotBlank(hash))
                            {
                                mvcThis.processHash(hash);
                            }
                        }

                        if  (mvcThis.preloadViews)
                        {
                            mvcThis.loadViews();
                        }
                    },
                    failure: function(data) {
                        if (this.debugOn)
                            console.log(this.timestamp() + "Failure loading context ["+contextLocation+"]: " + data);
                    },
                    error: function(data) {
                        if (this.debugOn)
                            console.log(this.timestamp() + "Error loading context ["+contextLocation+"]: " + data);
                    }
                });
            }
        }


        // Routing / dispatching mvc module
        if (this.debugOn) console.log(this.timestamp() + "Binding #hashchange functionality");
        var mvcThis = this;
        $(function(){
            $(window).hashchange( function(){
                var hash = location.hash;
                if (stringUtils.isNotBlank(hash))
                {
                    mvcThis.processHash(hash);
                }
            });
            $(window).hashchange();
        });
    }
    else
    {
        if (this.debugOn)
            console.log(this.timestamp() + "spa-mvc-js framework can not be started without configuration options");
    }
};
/**
 * IE console.log fix:
 */
if (!window.console) console = {log: function (s) {}};




