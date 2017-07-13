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
            sections: document.querySelectorAll('main section'),
        },
        templates: {
            overviewTemplate: document.getElementById('overview-template'),
            detailsTemplate: document.getElementById('details-template'),
            makersDropdownTemplate: document.getElementById('makers-dropdown-template'),
        },
        url: {
            base: 'https://www.rijksmuseum.nl/api/nl/collection/',
        }
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

    model = {
        getArtwork: function(paintingId, queryString, userQuery, sendData, initiator) {
            aja().url(config.url.base + paintingId + '?key=' + key.value + '&format=json&' + queryString + userQuery).on('success', function(data) {

                sendData(initiator, data);

            }).go();
        },

        filter: function(data) {

        }
    };











    //------------------------------------------------------------
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
        },
        dataCallback: function(initiator, data) {

            // console.log(initiator, data);

            if (Array.isArray(data)) {
                var art = { artObjects: data };
                controller.render(initiator, art);

            } else {
                controller.render(initiator, data);

            }

            if (data.artObjects && data.artObjects.length > 1) {
                controller.render('makers', data);
            }
        },
        render: function(initiator, data) {
            var self = this;

            switch (initiator) {
                case 'overview':
                    // console.log(data.count);

                    if (data.count) {
                        view.overview(data, '');

                    } else {
                        view.overview(data, 'filter');

                    }
                    // if (data.artObjects && data.artObjects.length > 1) {
                    // }


                    self.makersDropdown(data);
                    break;
                case 'detail':
                    view.detail(data);

                    break;
                case 'makers':
                    view.dropdown(data);

                    break;

                default:

                    view.overview(data);
            }
        },

        centuryDropdown: function() {
            var self = this;
            config.elements.centuryDropdown.addEventListener('change', function(event) {

                self.getData('overview', '', 'ps=40&f.dating.period=', this.value);
            });

        },

        makersDropdown: function(data) {
            var self = this;

            config.elements.makersDropdown.addEventListener('change', function(event) {
                console.log(data);
                var self = this;
                var promise = new Promise(function(resolve) {

                    if (data) {
                        resolve(data);
                    }
                });

                promise.then(function(result) {

                    if (self.value === 'iedereen') {
                        arrayCheck(self.name, self.value, 'iedereen');

                    } else {
                        arrayCheck(self.name, self.value, 'maker');

                    }
                    controller.dataCallback('overview', filterData(result.artObjects));
                    console.log(result.artObjects.length, filterData(result.artObjects));
                }, function(err) {
                    console.log(err); // Error: "It broke"
                });

                // if (this.value === 'iedereen') {

                //     arrayCheck(this.name, this.value, '');
                // } else {

                //     arrayCheck(this.name, this.value, 'maker');
                // }
                // self.getData('overview', '', 'ps=40&f.dating.period=', this.value);
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


    //-----------------------------------------
    view = {
        overview: function(data, fill) {
            // while (config.elements.overview.hasChildNodes()) {
            //     config.elements.overview.removeChild(config.elements.overview.lastChild);
            // }

            // if (!fill) {

            //     while (config.elements.overview.hasChildNodes()) {
            //         config.elements.overview.removeChild(config.elements.overview.lastChild);
            //     }
            //     test();

            //     data = null;
            // } else {
            //     test();
            // }
            test();

            function test() {

                var template = Handlebars.compile(config.templates.overviewTemplate.innerHTML);
                config.elements.overview.innerHTML = template(data);
            }


        },

        detail: function(data) {

            function returnHtml() {
                function imageAvailable() {
                    if (data.artObject.webImage !== null) {
                        return data.artObject.webImage.url;
                    }
                    return './static/images/background_black.svg';
                }

                function descriptionAvailable() {
                    if (data.description !== null) {
                        return data.artObject.description;
                    }
                    return 'Geen beschrijving beschikbaar';
                }

                var template = Handlebars.compile(config.templates.detailsTemplate.innerHTML);
                var htmlContent = template(

                    {
                        artMaker: data.artObject.principalOrFirstMaker,
                        longTitle: data.artObject.longTitle,
                        artImgUrl: imageAvailable(),
                        artDescription: descriptionAvailable()
                    }
                );
                return htmlContent;
            }
            document.getElementById('details').innerHTML = returnHtml();
        },

        dropdown: function(data) {
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
            }
        }
    };




    function renderview(reviewData) {

        overviewContainer[0].innerHTML = filter(reviewData)
            .reduce(function(html, object, i) {

                return html + `
                                     <div class="review">
                                         <div>
                                             <img src="${object.review.imgURL}" alt="">
                                         </div>
                                         <div class="text-container">
                                             <span class="rating">Score: ${ object.review.reviewRating }</span>
                                             <a class="detail-link" href="/detail/${ object.review.seriesName }">
                                                 <h3>${ object.review.seriesName }</h3>
                                             </a>
                                             <p class="post-date">Op: ${object.user.postDate }</p>
                                             <h4>${ object.review.reviewTitle }</h4>
                                             <p class="post-user">Door ${ object.user.name }</p>


                                             <p class="intro-text">${ object.review.reviewPlot.substring(0, 210) }
                                                   <a class="bottom-link" href="/detail/${ object.review.seriesName }">
                                                     Lees meer
                                                 </a>
                                             </p>
                                         </div>
                                     </div>
                                `;
            }, '');

    }

    function arrayCheck(filterName, filterValue, checkValue) {
        // console.log(checkValue);
        switch (checkValue) {
            case true:
                if (Array.isArray(filterValue) === false && !(filterName in filters)) {

                    setFilter(filterName, new Array(filterValue));

                } else if (filters[filterName].indexOf(filterValue) == -1) {

                    filters[filterName].push(filterValue);
                }
                break;
            case false:
                if (Array.isArray(filterValue) === false) {

                    removeFilter(filterName, new Array(filterValue));
                } else {

                    removeFilter(filterName, filterValue);
                }
                break;
            case 'maker':

                if (filterValue !== 'iedereen') {

                    setFilter(filterName, new Array(filterValue));
                } else {
                    // removeFilter(filterName, filterValue);
                }

                break;

                // case 'iedereen':
                //     console.log('iedereen');
                //     removeFilter(filterName, filterValue);
        }
    }

    function setFilter(filterName, filterValue) {

        filters[filterName] = filterValue;

    }

    function removeFilter(filterName, filterValue) {
        console.log(filters, Object.keys(filters).length > 0);

        if (Object.keys(filters).length > 0) {
            var index = filters[filterName].indexOf(filterValue);

            if (index === -1) {

                delete filters[filterName];

            }

            // else if (index > -1) {

            //     filters[filterName].splice(index, 1);
            //     delete filters[filterName];

            // }
        }

    }

    function filterData(data) {
        console.log(Object.keys(filters).length === 0, data);
        return data.filter(function(meta) {

            if (Object.keys(filters).length === 0) {
                // console.log(Object.keys(filters), Object.keys(filters).length);
                return true;
                // return Object.keys(filters).every(function(key) {
                //     console.log(key, 'key');

                //     return true; // For each key in filter return filter key value
                // });

            } else {
                return Object.keys(filters).some(function(key) {

                    return filterSet(key); // For each key in filter return filter key value
                });
            }

            function filterSet(keyName) {
                return filters[keyName].some(function(filterOptions) { // Compare filter options with serie tags
                    console.log(filterOptions === meta.principalOrFirstMaker, 'filter');

                    return filterOptions === meta.principalOrFirstMaker;
                    // return meta.review[keyName].some(function(seriesTags) {

                    // });
                });
            }
        });

    }

    app.init();
}());
