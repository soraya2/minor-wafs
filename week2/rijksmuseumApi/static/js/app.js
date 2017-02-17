(function(){

    'use strict';

    var selectSection,sectionsId, i;
    var getSections = document.getElementsByTagName('main section');


    var app = {
        init: function() {
            routes.init();
            sections.toggle();

        }
    };

    var routes = {
        init: function() {
            var startHash = window.location.hash;
            window.location.hash = '#home';

            // check if hash value is empty otherwise just use the hash value
            (!startHash) ? [startHash = 'home', sections.toggle(startHash)] : (startHash ? startHash : startHash = startHash)

            //Add event hashchange listener to toggle function
            window.addEventListener('hashchange', function(){
                sections.toggle(location.hash.split('#')[1]);
            });
        }
    };
    var getSections = document.querySelectorAll('main section');

    //Get all sections and add class if selected link is equal to section id
    var sections = {

        toggle: function(route) {
            for (i=0; i < getSections.length; i++){

            	selectSection = getSections[i];
            	sectionsId = getSections[i].id;
                selectSection.classList.add('hide');

            	(sectionsId === route) ? selectSection.classList.remove('hide') : selectSection.classList.add('hide');
            }
        }
    };

   app.init();

}());
