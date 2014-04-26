spa-mvc-js (v1.0.3)
-------------------

The goal of this project is a simple Single Page Application Model-View-Controller framework for JavaScript.

Features
--------
* Small in size, jQuery based, simple SPA MVC for front-end
* Controller logic and routing bindings are separate from views, layouts and styles
* View template services provided by a popular Handlebars framework
* Option to encrypt #hash url parameters (CryptoJS AES)
* Bookmarkable #hash history via a cross-browser HTML5 window.onhashchange event
* Startup UI Bindings (separate from possible controller bindings)
* Single place to configure context: startup, views and controllers
* Asynchronous context and controllers loading
* JSON context MVC configuration / settings file(s)
* Ability to pre-load all views or load/cache upon initial view request

Framework sample JSON configuration
--------------------
<pre>
{
    "startupController": ["indexController"],
    "startupUiBindings": ["startupUiBindings"],
    "viewsUrlMap": [
        {"LearnMore": "views/LearnMore.html"},
        {"Overview": "views/Overview.html"},
        {"Reports": "views/Reports.html"},
        {"Index": "views/Index.html"}
    ],
    "routeControllerMap": [
        {"learn-more": "learnMoreController"},
        {"overview": "overviewController"},
        {"reports": "reportsController"},
        {"index": "indexController"}
    ]
}
</pre>

Web root directory structure
----------------------------
<pre>
├── <b>css</b> <em>(contains application stylesheets)</em>
│
├── <b>js</b>
│   │
│   ├── <b>crypto-js</b> <em>(contains encryption libraries)</em>
│   │
│   └── <b>mvc</b> <em>(contains spa-mvc.js)</em>
│       │
│       ├── <b>controllers</b> <em>(contains controller classes)</em>
│       │
│       └── <b>models</b> <em>(contains model dto classes)</em>
│
└── <b>views</b> <em>(contains html view templates)</em>
</pre>

SPA MVC Application context startup
-----------------------------------
<pre>
var configParams =
{
    "sessionId": "12345678901234567890",
    "encryptHashParams": true,
    "debugOn": true,
    "preloadViews": true,
    "context": ["spa-mvc-context.json"]
};
var mvc = new SpaMvc(configParams);
mvc.loadSpaMvcContext();
</pre>


External libraries used
-----------------------

* [jquery](http://jquery.com/) - standard DOM manipulation
* [handlebars](http://handlebarsjs.com/) - view template framework
* [hashchange](http://benalman.com/projects/jquery-hashchange-plugin/) - browser address hashchange
* [crypto-js (AES)](https://code.google.com/p/crypto-js/) - url hash commands cryptography


Demo
----
[http://spa-mvc-js.temesoft.com/](http://spa-mvc-js.temesoft.com/) - Very simple 4 view/controller demo app


Running demo
------------
* This project includes the demo app which can run inside any html web server
* Just point your web server to the newly created directory .../spa-mvc-js
* Use your browser to navigate to /index.html




