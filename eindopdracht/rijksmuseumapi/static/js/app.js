(function() {
    'use strict';

    var config, app, model, controller, view, filters;

    filters = {};

    config = {
        elements: {
            searchForm: document.getElementById('search-form'),
            searchInput: document.getElementById('user-input'),
            makersDropdown: document.getElementById('makers-dropdown'),
            centuryDropdown: document.getElementById('century-dropdown'),
            overview: document.getElementById('overview'),
            detailsView: document.getElementById('details'),
            sections: document.querySelectorAll('main .content'),
            images: document.querySelectorAll('img')
        },
        templates: {
            overviewTemplate: document.getElementById('overview-template'),
            detailsTemplate: document.getElementById('details-template'),
            makersDropdownTemplate: document.getElementById('makers-dropdown-template'),
        },
        url: {
            base: 'https://www.rijksmuseum.nl/api/nl/collection/',
        },
        filters: {}
    };

    app = {
        init: function() {
            controller.routes();
            controller.getData('overview', '', 'p=1&ps=5', '');
            controller.centuryDropdown();
            controller.makersDropdown();
            controller.searchBar();
        }
    };

    // MODEL
    model = {
        getArtwork: function(paintingId, queryString, userQuery, sendData, initiator) {
            aja().url(config.url.base + paintingId + '?key=' + key.value + '&format=json&' + queryString + userQuery).on('success', function(data) {
                var promise = new Promise(function(resolve) {

                    if (data) {
                        resolve(data);
                    }
                });

                promise.then(function(result) {
                    view.loader();
                    sendData(initiator, result);

                }, function(err) {
                    console.log(err); // Error: "It broke"
                });

            }).go();
        },

        filterData: function(data) {

            var filterData = data.artObjects.filter(function(artObject) {

                if (Object.keys(filters).length === 0) {
                    return Object.keys(filters).every(function(key) {

                        return filterSet(key); // For each key in filter return filter key value
                    });

                } else {
                    return Object.keys(filters).some(function(key) {

                        return filterSet(key); // For each key in filter return filter key value
                    });
                }

                function filterSet(keyNaam) {

                    return filters[keyNaam].some(function(filterOptions) { // Compare filter options with serie tags

                        return filterOptions === artObject[keyNaam];
                        // return artObject[keyNaam].some(function(maker) {

                        // });
                    });
                }

            });
            return filterData;
        },

        setFilter: function(filterName, filterValue) {
            var self = this;

            if (filterValue[0] !== 'alles') {

                filters[filterName] = filterValue;
            } else {

                delete filters[filterName];

            }
        },

        arrayCheck: function(filterName, filterValue) {
            var self = this;

            if (Array.isArray(filterValue) === false) {

                self.setFilter(filterName, new Array(filterValue));
            } else {

                self.setFilter(filterName, filterValue);
                console.log(filters);
            }
        },
        uniqData: function(a) {
            var data = {};
            var seen = {};
            if (a) {

                data.artObjects = a.filter(function(item) {
                    return seen.hasOwnProperty(item.principalOrFirstMaker) ? false : (seen[item.principalOrFirstMaker] = true);
                });

                return data;
            }
        },
    };

    // CONTROLLER
    controller = {

        routes: function() {

            routie({
                '': function() {
                    location.hash = '#home';
                },
                home: function() {

                    view.toggle(this.path);

                },
                'details/:id': function(id) {
                    var path = this.path.slice(0, 7);

                    controller.getData('detail', this.params.id, '', '');

                    view.toggle(path);

                }
            });
        },

        getData: function(initiator, paintingId, queryString, userQuery) {
            var self = this;

            model.getArtwork(paintingId, queryString, userQuery, self.dataCallback, initiator);

            // function callback(initiator, data) {


            //     controller.render(initiator, data);
            //     self.render('makers', self.uniqData(data.artObjects));
            //     controller.makersDropdown(data);
            // }
        },
        dataCallback: function(initiator, data) {

            if (Array.isArray(data)) {
                var art = { artObjects: data };
                controller.render(initiator, art);

            } else {
                controller.render(initiator, data);
                controller.render('makers', model.uniqData(data.artObjects));
                controller.makersDropdown(data);
                controller.render(initiator, data);
            }

            // if (data.artObjects && data.artObjects.length > 1) {
            // }

        },

        render: function(initiator, data) {
            var self = this;

            switch (initiator) {
                case 'overview':

                    view.overview(data, '');

                    break;

                case 'detail':

                    view.detail(data);
                    break;

                case 'makers':

                    view.dropdown(data);
                    break;

                case 'filter':

                    view.overview(data, 'filter');
                    break;

                default:

                    view.overview(data);
            }
        },

        centuryDropdown: function() {
            var self = this;
            config.elements.centuryDropdown.addEventListener('change', function(event) {

                function valueCheck(value) {

                    return value !== '' ? '=' : '';
                }

                self.getData('overview', '', 'ps=40&f.dating.period' + valueCheck(this.value), this.value);
            });

        },

        makersDropdown: function(data) {

            config.elements.makersDropdown.addEventListener('change', function(event) {

                var self = this;
                var promise = new Promise(function(resolve) {

                    if (data) {
                        resolve(data);
                    }
                });

                promise.then(function(result) {
                    model.arrayCheck(self.name, self.value);

                    controller.dataCallback('filter', model.filterData(result));

                }, function(err) {
                    console.log(err); // Error: "It broke"
                });
            });
        },

        searchBar: function() {
            var self = this;
            config.elements.searchForm.addEventListener('submit', function(event) {
                event.preventDefault();
                self.getData('overview', '', 'q=', config.elements.searchInput.value);
            });
        }
    };

    // VIEWS
    view = {
        overview: function(data, fill) {

            var template;
            if (!fill) {

                while (config.elements.overview.hasChildNodes()) {
                    config.elements.overview.removeChild(config.elements.overview.lastChild);
                }
                template = Handlebars.compile(config.templates.overviewTemplate.innerHTML);
                config.elements.overview.innerHTML = template(data);

                data = null;
            } else {
                template = Handlebars.compile(config.templates.overviewTemplate.innerHTML);
                config.elements.overview.innerHTML = template(data);
            }
        },

        detail: function(data) {
            console.log(data);

            function returnHtml() {
                function imageAvailable() {
                    if (data.artObject.webImage !== null) {
                        return data.artObject.webImage.url;
                    }
                    return './static/images/background_black.svg';
                }

                function descriptionAvailable() {
                    if (data.description !== null) {
                        return data.artObject.label.description;
                    }
                    return 'Geen beschrijving beschikbaar';
                }

                var template = Handlebars.compile(config.templates.detailsTemplate.innerHTML);
                var htmlContent = template(

                    {
                        artMaker: data.artObject.principalOrFirstMaker,
                        title: data.artObject.label.title,
                        longTitle: data.artObject.label.description,
                        date: data.artObject.dating.presentingDate,
                        markLine: data.artObject.label.makerLine,
                        artImgUrl: imageAvailable(),
                        artDescription: descriptionAvailable()
                    }
                );
                return htmlContent;
            }
            document.getElementById('details').innerHTML = returnHtml();
        },

        dropdown: function(data) {
            console.log(data);
            var template = Handlebars.compile(config.templates.makersDropdownTemplate.innerHTML); // Compile handlebars template to html
            var htmlContent = template(data); // Insert data in template

            config.elements.makersDropdown.innerHTML = htmlContent;
        },

        toggle: function(route) {
            var i, selectSection, sectionsId, sections;

            sections = config.elements.sections;

            for (i = 0; i < sections.length; i++) {
                selectSection = sections[i];
                sectionsId = sections[i].id;

                (sectionsId === route) ? selectSection.classList.remove('hide'): selectSection.classList.add('hide');

                if (route === "home") {

                    config.elements.searchForm.parentElement.classList.remove('hide');

                }
            }
        },
        loader: function() {
            console.log('loader');

            config.elements.overview.innerHTML = '';

        }
    };
    app.init();
}());
