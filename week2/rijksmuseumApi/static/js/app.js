(function(){

    'use strict';
    window.location.hash = '#home';
    var getSections = document.querySelectorAll('main .content');

    var app = {
        init: function() {
            routes.init();
        }
    };

    var routes = {
        init: function() {
            var startHash = window.location.hash;

            if (startHash==="#home"){
              // console.log(getSections.children);
              // sections.toggle(startHash);
            }
            // check if hash value is empty otherwise just use the hash value
            if (window.location.hash==='') {
              return startHash = 'home';
            }

            //Add event hashchange listener to toggle function
            window.addEventListener('hashchange', function() {
                sections.toggle(location.hash.split('#')[1]);
            });
        }
    };

    //Get all sections and add class if selected link is equal to section id
    var sections = {

        toggle: function(route) {
            var selectSection,sectionsId, i;
            console.log("toggle")

            for (i=0; i < getSections.length; i++) {
              selectSection = getSections[i];
              sectionsId = getSections[i].id;

              (sectionsId === route) ? selectSection.classList.remove('hide') : selectSection.classList.add('hide');
            }
        }
    };

   app.init();

}());
