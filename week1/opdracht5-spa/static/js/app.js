 (function(){

		'use strict';

    var app = {
        init: function() {
            routes.init();
            // sections.init();
        }

    };

   var routes = {
        init: function() {
            window.addEventListener("hashchange", function(){
                sections.toggle(location.hash.split('#')[1]);
            });
        }
    };

   var sections = {
   	/* this is location.hash */
        toggle: function(route) {
            var section = document.querySelectorAll('main section');
            for (var i=0; i < section.length; i++){
            	var el = section[i];
            	var elId = section[i].id;

            	(elId === route) ? el.classList.remove("hide") : el.classList.add("hide");
            }
        },
				// init: function(){
				//   		console.log((route === ' ') ? "empty" : "full");

				// }

    };

   app.init();

}());

