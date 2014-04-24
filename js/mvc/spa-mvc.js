/**
 * SPA-MVC utility class provides routing, view-model template processing
 *
 * The mvc.context.js loads in the mvc context:
 *     mvc.viewsUrlMap
 *     mvc.routeControllerMap
 *     mvc.controllersMap
 *
 * View loader is able to load views run-time when requested for
 * the first time or pre-load them all on the initial startup
 *     mvc.viewsMap
 *
 *
 * To clear view cache use: mvc.viewsMap.clear();
 *
 * @constructor
 */
function SpaMvc()
{
    this.viewsUrlMap        = new HashTable({});
    this.uiBindingsMap      = new HashTable({});
    this.viewsMap           = new HashTable({});
    this.controllersMap     = new HashTable({});
    this.routeControllerMap = new HashTable({});

    this.processView = function(viewName, model)
    {
        var viewTemplate = mvc.viewsMap.getItem(viewName);
        if (viewTemplate == null || viewTemplate == undefined)
        {
            this.loadView(viewName);
            viewTemplate = mvc.viewsMap.getItem(viewName);
        }
        var template = Handlebars.compile(viewTemplate);
        return template(model);
    }

    this.loadViews = function()
    {
        var keys = Object.keys(mvc.viewsUrlMap.items);
        for (var i = 0; i < keys.length; i++)
        {
            this.loadView(keys[i]);
        }
    };

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
            async: false
        });
    };
};
var mvc = new SpaMvc();


/**
 * IE console.log fix:
 * http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 */
if (!window.console) console = {log: function() {}};