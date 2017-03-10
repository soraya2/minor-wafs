// url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"
// on submit spinner starten en pas stoppen als de data is geladen.
//https://developer.mozilla.org/nl/docs/Web/API/Document/readyState

/* Todo */

//callback toevoegen die de event listener toevoegd
//andere search query zodat je kan filteren

(function() {

    'use strict';
    var drop = document.getElementById('dropdown2');
    var option;
    var hello;
    var makerName = [];

    var config = {
      baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection/'
    };

    var app = {
      init: function(){
        controller.routes();
        // controller.searchInput();
        model.getPaintingsByCentury();
        controller.getDropdownValue();
        controller.selectNameMaker();
      }
    };

    // var routes = {
    //   routes: function(){
//         routie({
//             '': function() {
//                   location.hash = '#home';
//             },
//             'home': function(){
//             },

//             'art/:id': function(id) {

//                 console.log('details');
//             }
    //     });
    //   },
    // };

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
                event.preventDefault();

              if(userInput.value !==''){

                var input = userInput.value;

                model.getPaintings(input);
              }
          });
        },

      getPaintingId: function(selectPaintingOverview){

        selectPaintingOverview.addEventListener('click', function(event){

            event.preventDefault();

            model.getPaintingDetails(event.target.parentElement.id);
            controller.routes();
        });
      },

      getDropdownValue: function(){

        var dropdownValue = document.getElementById('eeuw');
        dropdownValue.selectedIndex = 0;
        dropdownValue.addEventListener('change', function(event){
              model.getPaintingsByCentury(dropdownValue.value);

         });

      },


      selectNameMaker: function (param1) {
          var save = param1;
          var makersNameDropdown = document.getElementById('maker');
          makersNameDropdown.selectedIndex = 0;
          // console.log(makersNameDropdown.value);
          function testing(){
              var kek = makersNameDropdown.value;
              // console.log(param1);

              return view.dropdownData(save,kek);
              // view.dropdownData(param1,kek);

          }
          makersNameDropdown.addEventListener("change", function(){


                                      testing();


          }, false);
              // view.dropdownData().test(makersNameDropdown.value);
                      testing();


              // console.log(dropdownValue2.value);

              // console.log(hello);
              // view.name(hello);
              // // console.log(view);
              // console.log(helloName());




              // model.getPaintingsByCentury(dropdownValue2.value);


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

      getPaintingsByCentury: function(dropdownValue) {
        // format=json&ps=200&f.dating.period=18

         aja()
            .url(config.baseUrl+"?key=LTaH2LtF&format=json&ps=20&f.dating.period=19")

            .on('success', function(info) {
              console.log(info);

              var artworkInfo2 = info.artObjects;
              view.paintingCentury(info);
              controller.selectNameMaker(info);

            })
            .go();
      },

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

              var content = {
                artMaker : artworkInfo.principalOrFirstMaker,
                longTitle: artworkInfo.longTitle,
                artImgUrl: imageAvailable(),
                artDescription: descriptionAvailable()
              };

              var template = Handlebars.compile(source);
              var htmlContent = template(content);

              return htmlContent;
          }

          document.getElementById('details').innerHTML = returnHtml();
      },

      paintingCentury: function(data){



        var source = document.getElementById("home-template").innerHTML;//javascipt template
                    //content

          var template = Handlebars.compile(source);
          var htmlContent = template(data);

         document.getElementById('home-overview').innerHTML = htmlContent;

      },



      dropdownData: function(data,value){

        console.log(value,"value");
        console.log(data, "data");
        var source = document.getElementById("maker-dropdown").innerHTML;//javascipt template

                    //content
          var template = Handlebars.compile(source);
          var htmlContent = template(data);

         document.getElementById('maker').innerHTML = htmlContent;

      }
    };



    app.init();

}());




// function callbackTester (callback) {
//     callback (arguments[1], arguments[2]);
// }

// callbackTester (tryMe, "hello", "goodbye");
