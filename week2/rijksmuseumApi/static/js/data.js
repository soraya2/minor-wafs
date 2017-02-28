// url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"
// on submit spinner starten en pas stoppen als de data is geladen.
//https://developer.mozilla.org/nl/docs/Web/API/Document/readyState
(function() {

    'use strict';

    var config = {
      baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection/'

    };


    var app = {
      init: function(){
        controller.routes();
        controller.searchInput();

      }
    };



    //controller responsible for user events
    var controller = {
      routes: function(){
            routie({
                '': function() {
                      location.hash = '#home';
                },
                'home': function(){

                },

                'art/:id': function(id) {
                    console.log('details');
                }
            });
          },

      searchInput: function(){
          var form = document.querySelector('.search-form');
          var userInput = document.getElementById('userInput');

          form.addEventListener('submit', function(event){


              if(userInput.value !==''){

                event.preventDefault();
                var input = userInput.value;
                model.getPaintings(input);
              }
          });
        },

      getPaintingId: function(selectPaintingOverview){

          selectPaintingOverview.addEventListener('click', function(event){
                event.preventDefault();
                console.log(event.target.parentElement.id);

                model.getPaintingDetails(event.target.parentElement.id);
                controller.routes();
          });

      }
    };




    //model resposible for storing data
    var model = {
      getPaintings: function(searchQuery) {

       aja()
            .url(config.baseUrl+"?key=LTaH2LtF&format=json&q="+ searchQuery)

            .on('success', function(data) {
                view.paintingsOverview(data);
            })

            .go();

      },

      getPaintingDetails: function(paintId) {

         aja()
            .url(config.baseUrl+paintId+"?key=LTaH2LtF&format=json")

            .on('success', function(info) {

              var artworkInfo = info.artObject;
              view.paintingDetails(artworkInfo);

            })
            .go();

      },

      // save:function() {


      // }

    };
    //responsible for rendering html

    var view = {
      paintingsOverview: function(data){
         function imageCheck(){

            if (webImage !== null) {
              return webImage.url;

            }else {
              return"./static/images/background_black.svg";

            }
        }

        var source = document.getElementById("overview-template").innerHTML;//javascipt template
        //content

        var template = Handlebars.compile(source);
        var htmlContent = template(data);

       document.getElementById('painting-overview').innerHTML = htmlContent;
       controller.getPaintingId(document.getElementById('painting-overview'));

      },

      paintingDetails: function(artworkInfo){
         function returnHtml(){

           function imageAvailable(){
                if (artworkInfo.webImage !== null){
                    return artworkInfo.webImage.url;
                }else{
                  return"./static/images/background_black.svg";
                }
              }
           function descriptionAvailable(){
              if (artworkInfo.description!== null) {
                    return artworkInfo.description;
                }else{
                  return"Geen beschrijving beschikbaar";
                }
              }

         var source = document.getElementById("detail-template").innerHTML;//javascipt template
              //content
              var content = {
                artMaker : artworkInfo.principalOrFirstMaker,
                longTitle: artworkInfo.longTitle,
                artImgUrl: imageAvailable(),
                artDescription: descriptionAvailable()
              };
              //compile content naar html
              var template = Handlebars.compile(source);
              var htmlContent = template(content);

              return htmlContent;
          }
          document.getElementById('details').innerHTML = returnHtml();

      },

      toggle: function(){


      }
    };

    app.init();

}());
