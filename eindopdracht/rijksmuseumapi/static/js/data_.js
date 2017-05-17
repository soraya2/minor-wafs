// Url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"

(function () {
  'use strict';

  var config, getData, userEventRespond;
  var getPaintingOverview = false;
  var form = document.querySelector('.search-form');
  var htmlContent = '';

  config = {
    userInput: document.getElementById('userInput'),
    button: document.getElementById('submit'),
    url: 'https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=',
    baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection/',
    _key: '?key=LTaH2LtF',
    html: ''
  };

  var routes = {
    init: function () {
      routie('details');
    }
  };

  getData = {
    details: function (paintingNumber) {
      aja()
            .url(config.baseUrl + paintingNumber + config._key + '&format=json')

            .on('success', function (info) {
              var artworkInfo = info.artObject;
              // Console.log(artworkInfo);

              function returnHtml() {
                function imageAvailable() {
                  if (artworkInfo.webImage !== null) {
                    return artworkInfo.webImage.url;
                  }
                  return './static/images/background_black.svg';
                }
                function descriptionAvailable() {
                  if (artworkInfo.description !== null) {
                    return artworkInfo.description;
                  }
                  return 'Geen beschrijving beschikbaar';
                }

                var source = document.getElementById('detail-template').innerHTML;// Javascipt template
                    // content
                var content = {
                  artMaker: artworkInfo.principalOrFirstMaker,
                  longTitle: artworkInfo.longTitle,
                  artImgUrl: imageAvailable(),
                  artDescription: descriptionAvailable()
                };
                    // Compile content naar html
                var template = Handlebars.compile(source);
                var htmlContent = template(content);

                return htmlContent;

                  // Return  `
                  //   <section class="item2">
                  //       <h1>${artworkInfo.longTitle}</h1>
                  //       <img src = ${imageAvailable()}></img>
                  //       <p>${descriptionAvailable()}</p>
                  //   </section>
                  // `;
              }
              document.getElementById('details').innerHTML = returnHtml();
            })
            .go();
    },

    overview: function (searchQuery) {
      aja()
            .url(config.baseUrl + config._key + '&format=json&q=' + searchQuery)

            .on('success', function (data) {
                  // < array

                    // Verander elk object naar een string > <div>Naam</div>

              function imageCheck() {
                if (webImage !== null) {
                  return webImage.url;
                }
                return './static/images/background_black.svg';
              }

              var source = document.getElementById('overview-template').innerHTML;// Javascipt template
                    // content

              var template = Handlebars.compile(source);
              var htmlContent = template(data);

              document.getElementById('painting-overview').innerHTML = htmlContent;

                  // Voeg elke string samen tot 1 grote string > <div>Naam</div><div>Naam</div>

              getPaintingOverview = true;
              userEventRespond.artworkDetail(document.getElementById('painting-overview'));
            })
            .go();
    },

    cbsData: function (searchQuery) {
      aja()
            .url(config.baseUrl + config._key + '&format=json&q=' + searchQuery)

            .on('success', function (data) {
                  // < array

                    // Verander elk object naar een string > <div>Naam</div>

              function imageCheck() {
                if (webImage !== null) {
                  return webImage.url;
                }
                return './static/images/background_black.svg';
              }

              var source = document.getElementById('overview-template').innerHTML;// Javascipt template
                    // content

              var template = Handlebars.compile(source);
              var htmlContent = template(data);

              document.getElementById('painting-overview').innerHTML = htmlContent;

                  // Voeg elke string samen tot 1 grote string > <div>Naam</div><div>Naam</div>

              getPaintingOverview = true;
              userEventRespond.artworkDetail(document.getElementById('painting-overview'));
            })
            .go();
    }
  };

  userEventRespond = {
    init: function () {
      form.addEventListener('submit', function (event) {
        if (config.userInput.value !== '') {
          event.preventDefault();
          var input = config.userInput.value;
          getData.overview(input);
        }
      });
    },

    artworkDetail: function (selectPaintingOverview) {
      if (getPaintingOverview === true) {
        selectPaintingOverview.addEventListener('click', function (event) {
          event.preventDefault();
          console.log(event.target.parentElement.id);

          getData.details(event.target.parentElement.id);
          routes.init();
        });
      }
    }
  };

  userEventRespond.init();
})();
