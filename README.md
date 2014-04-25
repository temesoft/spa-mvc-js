spa-mvc-js
==========

The goal of this project is create a simple, structured single page application model-view-controller framework for
JavaScript running inside the browser. The main idea is separation of view, controller and model within the application.
Remote calls and controller logic should be separate from views, layouts and styles. This framework loads all
configuration, controllers and views without waiting for DOM to be ready. Visible url address hash commands are
encrypted using CryptoJS.AES libraries.

Features
========
-  Simple front end SPA MVC
-  View template provided by a popular Handlebars framework
-  Controller logic and routing bindings are separate from views, layouts and styles
-  Encrypted hash parameters option to turn this parametrized hash url
-  Startup UI Bindings (separate from possible controller bindings)
-  Single place to configure views and controllers
-  Asynchronous context and controllers loading
-  JSON context MVC configuration


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
This project includes the demo app which can run inside any html web server

#1)     git clone https://github.com/temesoft/spa-mvc-js.git
#2)     Then point your web server DocumentRoot to the newly created directory .../spa-mvc-js
#3)     Use your browser to navigate to /index.html




