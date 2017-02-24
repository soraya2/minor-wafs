// url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"

//to do using a template engine or es6 convertion
//Turning short if else statements in to ternary operators
(function() {

    'use strict';

    var config, getData, userEventRespond;
    var getPaintingOverview = false;
    var form = document.querySelector('.search-form');


    config = {
        userInput: document.getElementById('userInput'),
        button: document.getElementById('submit'),
        url: 'https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=',
        baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection/',
        _key: '?key=LTaH2LtF',
        html: ''
    };

    var routes ={
      init: function(){
          routie('details');
      }
    };

    getData = {
      details: function(paintingNumber){
         aja()
            .url(config.baseUrl+paintingNumber+config._key+"&format=json")

            .on('success', function(info) {
              var artworkInfo = info.artObject;
              // console.log(artworkInfo.longTitle,"description");

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
                  return  `
                    <section class="item2">
                        <h1>${artworkInfo.longTitle}</h1>
                        <img src = ${imageAvailable()}></img>
                        <p>${descriptionAvailable()}</p>
                    </section>
                  `;
              }

              document.getElementById('painting-details').innerHTML = returnHtml();
            })
            .go();
      },

      overview: function(searchQuery) {
          aja()
            .url(config.baseUrl+config._key+"&format=json&q="+ searchQuery)

            .on('success', function(data) {

                   document.getElementById('painting-overview').innerHTML = data.artObjects// < array

                    // Verander elk object naar een string > <div>Naam</div>

                  .map(function(artwork, i) {
                    function imageCheck(){
                          if (artwork.webImage !== null){
                              return artwork.webImage.url;
                          }else{
                            return"./static/images/background_black.svg";
                          }

                    }
                     return `
                          <section id="${artwork.objectNumber}" class="kunstwerk${i} kunstwerk">
                                <h1>${artwork.principalOrFirstMaker}</h1>
                                <img src = ${imageCheck()}></img>
                                <p class="artwork-title">${artwork.title}</p>
                          </section>
                      `;

                  })

                  // Voeg elke string samen tot 1 grote string > <div>Naam</div><div>Naam</div>
                  .reduce(function(html,currentSection) {
                      return html+currentSection;
                  });

                  getPaintingOverview=true;
                  userEventRespond.init2(document.getElementById('painting-overview'));
            })
            .go();
        }
    };

    userEventRespond = {
        init: function() {
            form.addEventListener('submit', function(event){
                event.preventDefault();
                var input = config.userInput.value;
                getData.overview(input);
            });
        },

        init2: function (selectPaintingOverview){

            if (getPaintingOverview === true){
              selectPaintingOverview.addEventListener('click', function(event){
                event.preventDefault();
                getData.details(event.target.parentElement.id);
                routes.init();
              });
            }else{
              console.log('getPaintingOverview is false');
            }
          }
    };

    userEventRespond.init();

}());






