// Url: "https://www.rijksmuseum.nl/api/nl/collection/?key=LTaH2LtF&format=json&q=rembrand"
// on submit spinner starten en pas stoppen als de data is geladen.
// https://developer.mozilla.org/nl/docs/Web/API/Document/readyState
/* Todo */
// callback toevoegen die de event listener toevoegd
(function() {
    'use strict';
    var drop = document.getElementById('dropdown2');
    var makerName = [];
    var routes;
    var config = {
        baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection/'
    };
    var app = {
        init: function() {
            controller.routes();
            controller.searchInput();
            controller.getDropdownValue();
            controller.selectNameMaker();
        }
    };

    // controller responsible for user events
    var controller = {
        routes: function() {

            var Home = document.getElementById('#home');

            routie({
                '': function() {
                    location.hash = '#home';
                },
                home: function() {
                    view.toggle(this.path);

                },
                'details/:id': function(id) {
                    model.getPaintingDetails(this.params.id);
                    var path = this.path.slice(0, 7);
                    view.toggle(path);

                }
            });
        },
        searchInput: function() {
            var form = document.querySelector('.search-form');
            var userInput = document.getElementById('userInput');
            form.addEventListener('submit', function(event) {
                console.log(userInput.value);

                event.preventDefault();
                if (userInput.value !== '') {
                    var input = userInput.value;
                    model.getPaintings(input);

                }
            });
        },

        getDropdownValue: function() {
            var dropdownValue = document.getElementById('eeuw');
            dropdownValue.selectedIndex = 0;
            dropdownValue.addEventListener('change', function(event) {
                model.getPaintingsByCentury(dropdownValue.value);
            });
        },
        selectNameMaker: function(data) {
            var self = this;
            if (data !== undefined) {
                var save = data;
                var makersNameDropdown = document.getElementById('maker');
                makersNameDropdown.selectedIndex = 0;

                function testing() {
                    return view.dropdownData(data);
                }
                makersNameDropdown.addEventListener('change', function() {
                    return model.dropdownDataValue(makersNameDropdown.value);
                }, false);
                testing();
            }
        }
    };

    // Model resposible for storing data
    var model = {
        getPaintings: function(searchQuery) {
            var self = this;

            aja().url(config.baseUrl + '?key=' + key.value + '&format=json&q=' + searchQuery).on('success', function(data) {
                controller.selectNameMaker(data);
                view.paintingsOverview(data);
                self.artworkInfo = data.artObjects;

            }).go();
        },
        getPaintingDetails: function(paintId) {
            // console.log(paintId);
            aja().url(config.baseUrl + paintId + '?key=' + key.value + '&format=json&').on('success', function(info) {
                var artworkInfo = info.artObject;
                view.paintingDetails(artworkInfo);
            }).go();
        },
        getPaintingsByCentury: function(dropdownValue) {

            var self = this;

            function dropdownValueCheck() {
                if (dropdownValue === undefined) {
                    dropdownValue = '';
                    return dropdownValue;
                }
                dropdownValue = '=' + dropdownValue;
                return dropdownValue;
            }
            aja().url(config.baseUrl + '?key=' + key.value + '&format=json&' + 'ps=20&f.dating.period' + dropdownValueCheck()).on('success', function(info) {
                var artworkInfo = info.artObjects;
                view.paintingCentury(info);
                controller.selectNameMaker(info);
                self.artworkInfo = artworkInfo;
            }).go();
        },
        dropdownDataValue: function(value) {
            // Functie die data filtert op basis van naam en eeuw
            var self = this;
            var dropdownValue = value;
            var filter;

            function filterObjects(objects) {

                return objects.principalOrFirstMaker === dropdownValue;
            }

            filter = self.artworkInfo.filter(filterObjects);

            function artistCheck() {

                if (filter.length === 0) {
                    return self.artworkInfo;

                } else {
                    return filter;
                }
            }

            var info = {
                artObjects: artistCheck()
            };

            view.paintingCentury(info);
        }
    };
    // Responsible for rendering html
    var view = {
        paintingsOverview: function(data) {
            function imageCheck() {
                if (webImage !== null) {
                    return webImage.url;
                }
                return './static/images/background_black.svg';
            }
            var source = document.getElementById('home-template').innerHTML; // Javascipt template
            var template = Handlebars.compile(source);
            var htmlContent = template(data);
            document.getElementById('home-overview').innerHTML = htmlContent;

        },
        paintingDetails: function(artworkInfo) {
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
                var source = document.getElementById('detail-template').innerHTML; // Javascipt template
                var content = {
                    artMaker: artworkInfo.principalOrFirstMaker,
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
        paintingCentury: function(data) {
            var source = document.getElementById('home-template').innerHTML; // Javascipt template
            // content
            var template = Handlebars.compile(source);
            var htmlContent = template(data);
            document.getElementById('home-overview').innerHTML = htmlContent;

        },
        dropdownData: function(data) {
            var source = document.getElementById('maker-dropdown').innerHTML; // Javascipt template
            var template = Handlebars.compile(source); // Compile handlebars template to html
            var htmlContent = template(data); // Insert data in template
            document.getElementById('maker').innerHTML = htmlContent;
        },

        toggle: function(route) {

            var i, selectSection, sectionsId, sections;
            sections = document.querySelectorAll('main section');
            for (i = 0; i < sections.length; i++) {
                selectSection = sections[i];
                sectionsId = sections[i].id;

                (sectionsId === route) ? selectSection.classList.remove('hide'): selectSection.classList.add('hide');

            }
        }
    };
    app.init();
})();
