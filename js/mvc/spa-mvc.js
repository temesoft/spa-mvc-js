/**
 * SPA-MVC utility class provides Routing, view-model template processing for single page application functionality.
 *
 * View loader is able to load views run-time when requested for the first time or pre-load them all on the initial startup.
 *
 * To clear view cache use: mvc.viewsMap.clear();
 *
 * var configParams = {
 *      "sessionId": "12345678901234567890",
 *      "encryptHashParams": false,
 *      "debugOn": true,
 *      "useHashRouting": true,
 *      "preloadViews": true,
 *      "context": ["some/path/to/spa-mvc-context.json"]
 *  };
 *
 * @constructor
 */
function SpaMvc(options) {
    if (stringUtils.isNotUndAndNull(options)) {
        this.version                = "0.5";
        this.useHashRouting         = true;
        this.context                = null;  // Optional remote context config load. Ex:  "/some_dir/spa-mvc-context.json"
        this.contextData            = null;
        this.sessionId              = "pass-session-id-as-options-param";
        this.encryptHashParams      = true;
        this.debugOn                = false;
        this.preloadViews           = false;

        this.debug = function (msg) {
            if (this.debugOn) {
                console.log(this.timestamp() + " DEBUG: "+ msg);
            }
        };

        this.info = function (msg) {
            if (this.debugOn) {
                console.log(this.timestamp() + " INFO: "+ msg);
            }
        };

        this.error = function (msg) {
            if (this.debugOn) {
                console.log(this.timestamp() + " ERROR: "+ msg);
            }
        };

        if (stringUtils.isNotUndAndNull(options)) {
            if (options.sessionId != null) {
                this.sessionId = options.sessionId;
            }
            if (options.encryptHashParams != null) {
                this.encryptHashParams = options.encryptHashParams;
            }
            if (options.useHashRouting != null) {
                this.useHashRouting = options.useHashRouting;
            }
            if (options.debugOn != null) {
                this.debugOn = options.debugOn;
            }
            if (options.context != null) {
                this.context = options.context;
            }
            if (options.preloadViews != null) {
                this.preloadViews = options.preloadViews;
            }
            if (options.contextData != null) {
                this.contextData = options.contextData;
            }
        }

        if (this.debugOn) {
            console.log("   _____             __  ____      _______   _     ");
            console.log("  / ____|           |  \\/  \\ \\    / / ____| (_)    ");
            console.log(" | (___  _ __   __ _| \\  / |\\ \\  / / |       _ ___ ");
            console.log("  \\___ \\| '_ \\ / _` | |\\/| | \\ \\/ /| |      | / __|");
            console.log("  ____) | |_) | (_| | |  | |  \\  / | |____ _| \\__ \\");
            console.log(" |_____/| .__/ \\__,_|_|  |_|   \\/   \\_____(_) |___/");
            console.log("        | |                                _/ |    ");
            console.log("        |_|                               |__/     ");
            console.log("");
            console.log("spa-mvc-js (v: " + this.version + ")");
        }

        this.viewsUrlMap = new HashTable({});
        this.viewsMap = new HashTable({});
        this.controllersMap = new HashTable({});
        this.routeControllerMap = new HashTable({});

        /**
         * Processes the view template with model using handlebars
         * @param viewName
         * @param model
         */
        this.processView = function (viewName, model) {
            var startTime = new Date().getTime();
            var viewTemplate = mvc.viewsMap.getItem(viewName);
            if (viewTemplate == null || viewTemplate == undefined) {
                this.loadView(viewName);
                viewTemplate = mvc.viewsMap.getItem(viewName);
            }
            var template = Handlebars.compile(viewTemplate);
            this.debug("Processing view [" + viewName + "] " + ((new Date().getTime()) - startTime) + "ms");
            return template(model);
        };

        /**
         * Loads all available views
         */
        this.loadViews = function () {
            var keys = Object.keys(mvc.viewsUrlMap.items);
            for (var i = 0; i < keys.length; i++) {
                this.loadView(keys[i]);
            }
        };

        /**
         * Loads specified view
         * @param viewName
         */
        this.loadView = function (viewName) {
            var key = viewName;
            var viewUrl = this.viewsUrlMap.getItem(key);
            this.info("Loading View(" + key + ") from [" + viewUrl + "]");
            $.ajax({
                cache: false,
                url: viewUrl,
                type: "GET",
                success: function (data) {
                    mvc.viewsMap.setItem(key, data);
                    mvc.debug("View(" + key + ") " + data.length + " bytes");
                },
                failure: function (data) {
                    mvc.error("Failure loading View(" + key + ") " + data);
                },
                error: function (data) {
                    mvc.error("Error loading View(" + key + ") " + data);
                },
                async: false
            });
        };

        /**
         * Consumes URL hash calls and routs / dispatches the action to appropriate controller
         * @param hash
         */
        this.processHash = function (hash) {
            hash = hash.substring(1);
            var params = hash.split("|");
            if (params.length > 0) {
                var routing = params[0];
                if (window.mvc != undefined) {
                    var keys = mvc.routeControllerMap.keys();
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i] == routing) {
                            var controllerName = mvc.routeControllerMap.getItem(keys[i]);
                            var controller = mvc.controllersMap.getItem(controllerName);
                            params.shift(); // remove first element in array (routing param)
                            if (this.encryptHashParams && params.length > 0) {
                                var decParamStr = CryptoJS.AES.decrypt(params[0], mvc.sessionId);
                                controller(decParamStr.toString(CryptoJS.enc.Utf8).split("|"));
                            }
                            else {
                                controller(params);
                            }
                        }
                    }
                }
            }
        };

        /**
         * Routes / dispatches the hash command + params string
         * @param command
         * @param paramArray
         */
        this.routeCommand = function (command, paramArray) {
            var encRoute = "#" + command;
            var arrayParams = jQuery.makeArray(paramArray);
            if (arrayParams.length > 0) {
                if (this.encryptHashParams) {
                    encRoute = encRoute + "|" + CryptoJS.AES.encrypt(arrayParams.join("|"), mvc.sessionId).toString();
                }
                else {
                    encRoute = encRoute + "|" + jQuery.makeArray(paramArray).join("|");
                }
            }
            document.location = encRoute;
        };

        /**
         * Loads the context from json files remotely async
         */
        this.loadSpaMvcContext = function () {
            var mvcThis = this;
            var jsonConfigFilesArray = jQuery.makeArray(this.context);
            var startupController = [];

            function processData(data) {
                if (stringUtils.isNotBlank(jsonConfigFile)) {
                    mvcThis.debug("Processing json configuration file: " + jsonConfigFile);
                } else {
                    mvcThis.debug("Processing configuration data: " + JSON.stringify(data));
                }

                var viewsUrlMap = jQuery.makeArray(data.viewsUrlMap);
                var routeControllerMap = jQuery.makeArray(data.routeControllerMap);
                startupController = startupController.concat(jQuery.makeArray(data.startupController));
                var map, key, value;

                for (var i = 0; i < viewsUrlMap.length; i++) {
                    map = new HashTable(viewsUrlMap[i]);
                    key = map.keys()[0];
                    value = map.getItem(key);
                    mvcThis.debug("ViewsUrlMap: [" + key + "] = " + value);
                    mvcThis.viewsUrlMap.setItem(key, value);
                }

                for (var i = 0; i < routeControllerMap.length; i++) {
                    map = new HashTable(routeControllerMap[i]);
                    key = map.keys()[0];
                    value = map.getItem(key);
                    mvcThis.debug("RouteControllerMap: [" + key + "] = " + value + " {controller found:" + (controller != undefined) + "}");
                    mvcThis.routeControllerMap.setItem(key, value);
                    var controller = window[value];
                    mvcThis.controllersMap.setItem(value, controller);
                }
            }

            if (stringUtils.isNotUndAndNull(this.contextData)) {
                processData(this.contextData);
            }

            for (var i = 0; i < jsonConfigFilesArray.length; i++) {
                var jsonConfigFile = jsonConfigFilesArray[i];
                $.ajax({
                    url: jsonConfigFile,
                    type: "GET",
                    async: false,
                    success: function (data) {
                        processData(data);
                    },
                    failure: function (data) {
                        mvcThis.error("Failure loading context [" + contextLocation + "]: " + data);
                    },
                    error: function (data) {
                        mvcThis.error("Error loading context [" + contextLocation + "]: " + data);
                    }
                });
            }

            /**
             * Check if the config setting = true pre-load all views in available context
             */
            if (mvcThis.preloadViews) {
                mvcThis.info("Pre-loading (" + mvc.viewsUrlMap.length + ") views");
                mvcThis.loadViews();
            }

            /**
             * Execute all startup controllers / possibly ui bindings
             */
            this.debug("Executing (" + startupController.length + ") startup controllers");
            for (var i = 0; i < startupController.length; i++) {
                mvcThis.debug("Executing startup controller: [" + startupController[i] + "]");
                window[startupController[i]]();
            }

            /**
             * If there is hash command already in the web address - process through regular mvc route dispatcher
             */
            if (location.hash.indexOf("#") === 0) {
                var hash = location.hash;
                if (stringUtils.isNotBlank(hash)) {
                    mvcThis.processHash(hash);
                }
            }
        };

        this.timestamp = function () {
            var date = new Date();
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            var h = date.getHours().toString();
            var m = date.getMinutes().toString();
            var s = date.getSeconds().toString();
            var ms = date.getMilliseconds().toString();
            if (ms.length == 1) {
                ms = "00" + ms;
            } else if (ms.length == 2) {
                ms = "0" + ms;
            }
            var ymdDateTime = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + " " +
                (h[1] ? h : "0" + h[0]) + ":" + (m[1] ? m : "0" + m[0]) + ":" + (s[1] ? s : "0" + s[0]) + "." + ms;
            return (ymdDateTime) + "> ";
        };

        // Routing / dispatching mvc module
        if (this.useHashRouting) {
            this.info("Binding #hashchange routing functionality");
            var mvcThis = this;
            $(function () {
                $(window).hashchange(function () {
                    var hash = location.hash;
                    if (stringUtils.isNotBlank(hash)) {
                        mvcThis.processHash(hash);
                    }
                });
                $(window).hashchange();
            });
        }
    }
    else {
        mvcThis.error("spa-mvc-js framework can not be started without configuration options");
    }
};
/**
 * IE console.log fix:
 */
if (!window.console) {
    console = {log: function (s) {
    }};
}