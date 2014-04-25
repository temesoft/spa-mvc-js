spa-mvc-js
==========

The goal of this project is a very simple Single Page Application Model-View-Controller framework for JavaScript.

Features
========
* Small in size, simple SPA MVC for front end
* View template provided by a popular Handlebars framework
* Controller logic and routing bindings are separate from views, layouts and styles
* Encryption option of #hash url parameters (CryptoJS AES) 
* Bookmarkable #hash history via a cross-browser HTML5 window.onhashchange event
* Startup UI Bindings (separate from possible controller bindings)
* Single place to configure views and controllers
* Asynchronous context and controllers loading
* JSON context MVC configuration / settings file(s)
* Pre-load all views or load/cache when requested


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




