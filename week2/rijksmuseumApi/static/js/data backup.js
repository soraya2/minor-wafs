// url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"
(function() {
    'use strict';

    var config, getData, sendUserInput, result, sendPiaintId;
    var getPaintingOverview = false;
    var form = document.querySelector('.search-form');

    config = {
        userInput: document.getElementById('userInput'),
        button: document.getElementById('submit'),
        url: 'https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=',
        _key: '?key=LTaH2LtF',
        html: ''
    };


    var routes ={
      init: function(){
          routie('details');
      }

    };

    // var bere = [4,4,8,786];
    getData = {

      details: function(paintingNumber){

         aja()
            .url("https://www.rijksmuseum.nl/api/nl/collection/"+paintingNumber+config.key+"&format=json")

            .on('success', function(data) {

              function returnHtml(){
                  return  `
                    <section class="item2">
                        <h1>${data.artObject.longTitle}</h1>
                        <p>${data.artObject.description}</p>
                        <img src = ${data.artObject.webImage.url}></img>
                    </section>
                  `;
              }
              document.getElementById('painting-details').innerHTML = returnHtml();

            })
            .go();
      },

      overview: function(searchQuery) {
                aja()
                  .url(config.url + searchQuery)

                  .on('success', function(data) {

                      document.getElementById('painting-overview').innerHTML = data.artObjects // < array

                          // Verander elk object naar een string > <div>Naam</div>
                        .map(function(paint, i) {
                          console.log(paint);
                            return `
                                <section id="${paint.objectNumber}" class="item ${i}">
                                      <h1>${paint.principalOrFirstMaker}</h1>
                                      <p class="paint-title">${paint.title}</p>
                                      <img src = ${paint.webImage.url}></img>
                                </section>
                            `;
                        })
                        // Voeg elke string samen tot 1 grote string > <div>Naam</div><div>Naam</div>
                        .reduce(function(html,currentSection) {
                            return html+currentSection;
                        });

                      (function(){
                        getPaintingOverview=true;
                        return sendPiaintId.init(document.getElementById('painting-overview'));

                      }());
                  })
                  .go();
        }
    };

    sendUserInput = {
        init: function() {
            form.addEventListener('submit', function(event){
                event.preventDefault();
                var input = config.userInput.value;
                getData.overview(input);

            });
        },
    };

    sendPiaintId = {
        init: function (selectPaintingOverview){
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

    sendUserInput.init();



}());



