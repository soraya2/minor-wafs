(function () {
    //koop huur of nieubouw
    'use strict';

    var config = {
        baseUrl: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        zoekInput: document.getElementById('userInput'),
        kamers: document.getElementById('kamers'),
        overviewPagina: document.getElementById('overview-results'),
        detailPagina: document.getElementById('detail-results'),
        suggesties: document.getElementById('suggestion-results')

    };

    // var data = [];
    var app = {
        init: function () {
            controller.searchInput();
            controller.init();
            controller.kamers();
            routes.init();
            model.detailQuery();
        }
    };
    var routes = {

        init: function () {
            routie({
                '': function () {
                    window.location.hash = '#overview';
                    console.log(this.path);
                },
                'overview': function () {
                    console.log('page is ' + this.path);
                    // sections.toggle('#' + this.path);
                    // el.load1.classList.add('hide');
                },

                'search/:detail': function (detail) {
                    console.log('page is ' + this.path);
                    model.detailQuery();
                    // sections.toggle('#' + this.path );
                }
            });
        }
        // init: function() {
        //     if (window.location.hash === '') {
        //         window.location.hash = '#home';
        //         // this.details('hello');
        //         // console.log(location.pathname);
        //     }
        // },

        // details: function(objectId) {
        //     // console.log(objectId);
        //     window.location.hash = '#home' + "/" + objectId;
        //     // model.detailQuery();

        // }

    };
    var controller = {
        init: function () {

            window.addEventListener("load", function (event) {

                model.overviewQuery('');
            });
        },

        searchInput: function () {
            var form = document.querySelector('.search-form');

            form.addEventListener('submit', function (event) {

                event.preventDefault();
                model.overviewQuery(config.zoekInput.value);
            });
        },

        kamers: function (getRooms, formValue) {
            var newValue = "heel-nederland";

            config.kamers.addEventListener('change', function (event) {

                model.filterKamer(getRooms, config.kamers.value);
            });
        }
    };

    var model = {
        overviewQuery: function (userQuery, i) {
            // console.log(userQuery);

            var self = this;
            var price = [];

            aja().url(config.baseUrl + apiKey.value + '/?type=koop&zo=/' + userQuery + '/&page=1&pagesize=25').on('success', function (data) {
                console.log(userQuery);
                var myQuery = userQuery;
                var mydata = data;
                controller.kamers(mydata);
                // controller.prijs(mydata);
                view.homeOverview(data);
            }).go();
        },

        detailQuery: function () {
            console.log(location.hash);

            aja().url(config.baseUrl + '/detail/' + apiKey.value + '/koop/' + '643335c8-380f-4350-b0df-dff5b6da1573').on('success', function (data) {
                console.log(data);
                // var myQuery = userQuery;
                // var mydata = data;

                // controller.prijs(mydata);
                view.detailPage(data);
            }).go();
        },

        filterKamer: function (data, rooms) {
            var kamers2 = Number(rooms);
            if (data !== undefined) {

                function getKamers(kamers) {
                    return kamers.AantalKamers >= kamers2;
                    console.log(kamers.AantalKamers >= kamers2);
                }

                var filterdata = data.Objects.filter(getKamers);

                return view.filterdata(filterdata);
            }
        }

    };

    //es6 template litteral
    var view = {
        homeOverview: function (info) {

            if (info !== undefined) {

                config.overviewPagina.innerHTML = info.Objects

                // Voeg elke string samen tot 1 grote string > < div > Naam < /div><div>Naam</div >
                .reduce(function (html, object, i) {
                    function imageCheck() {

                        if (object.FotoLarge !== '/img/thumbs/thumb-geen-foto_groot.gif') {
                            return object.FotoLarge;
                        } else {
                            return '../files/img/background_black.svg';
                        }
                    }
                    return html + `
                <a href="#details/${object.Id}">
                  <section class="kunstwerk${i} kunstwerk">
                    <img src="${imageCheck()}" alt="{{Adres}}" />
                    <p class="object-info">€${object.Koopprijs} k.k</p>
                    <p class="object-info"><span>${object.AantalKamers} kamers</span> <span>${object.Adres}</span> ${object.Postcode} ${object.Woonplaats} </p>
                  </section>
                  </a>
                `;
                }, '');
            }
        },

        filterdata: function (info) {
            console.log(info);
            config.overviewPagina.innerHTML = info.reduce(function (html, object, i) {
                function imageCheck() {

                    if (object.FotoLarge !== '/img/thumbs/thumb-geen-foto_groot.gif') {
                        return object.FotoLarge;
                    } else {
                        return '../files/img/background_black.svg';
                    }
                }
                return html + `
                <a href="#search/${object.Id}">
                  <section class="kunstwerk${i} kunstwerk">
                    <img src="${imageCheck()}" alt="{{Adres}}" />
                    <p class="object-info">€${object.Koopprijs} k.k</p>
                    <p class="object-info"><span>${object.AantalKamers} kamers</span> <span>${object.Adres}</span> ${object.Postcode} ${object.Woonplaats} </p>
                  </section>
                  </a>
                `;
            }, '');
        },

        detailPage: function (info) {
            console.log(info);
            // config.overviewPagina.innerHTML = info
            //     .reduce(function(html, object, i) {
            //         function imageCheck() {

            //             if (object.FotoLarge !== '/img/thumbs/thumb-geen-foto_groot.gif') {
            //                 return object.FotoLarge;

            //             } else {
            //                 return '../files/img/background_black.svg';

            //             }
            //         }
            //         return html + `
            //       <section class="kunstwerk${i} kunstwerk">
            //         <img src = ${imageCheck()}></img>
            //         <p class="object-info">€${object.Koopprijs} k.k</p>
            //         <p class="object-info"><span>${object.AantalKamers} kamers</span> <span>${object.Adres}</span> ${object.Postcode} ${object.Woonplaats} </p>
            //       </section>
            //     `;
            //     }, '');
        }

    };

    app.init();
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsImJhc2VVcmwiLCJ6b2VrSW5wdXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwia2FtZXJzIiwib3ZlcnZpZXdQYWdpbmEiLCJkZXRhaWxQYWdpbmEiLCJzdWdnZXN0aWVzIiwiYXBwIiwiaW5pdCIsImNvbnRyb2xsZXIiLCJzZWFyY2hJbnB1dCIsInJvdXRlcyIsIm1vZGVsIiwiZGV0YWlsUXVlcnkiLCJyb3V0aWUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhhc2giLCJjb25zb2xlIiwibG9nIiwicGF0aCIsImRldGFpbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsIm92ZXJ2aWV3UXVlcnkiLCJmb3JtIiwicXVlcnlTZWxlY3RvciIsInByZXZlbnREZWZhdWx0IiwidmFsdWUiLCJnZXRSb29tcyIsImZvcm1WYWx1ZSIsIm5ld1ZhbHVlIiwiZmlsdGVyS2FtZXIiLCJ1c2VyUXVlcnkiLCJpIiwic2VsZiIsInByaWNlIiwiYWphIiwidXJsIiwiYXBpS2V5Iiwib24iLCJkYXRhIiwibXlRdWVyeSIsIm15ZGF0YSIsInZpZXciLCJob21lT3ZlcnZpZXciLCJnbyIsImRldGFpbFBhZ2UiLCJyb29tcyIsImthbWVyczIiLCJOdW1iZXIiLCJ1bmRlZmluZWQiLCJnZXRLYW1lcnMiLCJBYW50YWxLYW1lcnMiLCJmaWx0ZXJkYXRhIiwiT2JqZWN0cyIsImZpbHRlciIsImluZm8iLCJpbm5lckhUTUwiLCJyZWR1Y2UiLCJodG1sIiwib2JqZWN0IiwiaW1hZ2VDaGVjayIsIkZvdG9MYXJnZSIsIklkIiwiS29vcHByaWpzIiwiQWRyZXMiLCJQb3N0Y29kZSIsIldvb25wbGFhdHMiXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsWUFBQTtBQUNBO0FBQ0E7O0FBRUEsUUFBQUEsU0FBQTtBQUNBQyxpQkFBQSxpREFEQTtBQUVBQyxtQkFBQUMsU0FBQUMsY0FBQSxDQUFBLFdBQUEsQ0FGQTtBQUdBQyxnQkFBQUYs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O21EQUNBSixPQUFBUixZQUFBLHdCQUFBUSxPQUFBSyxLQUFBLFdBQUFMLE9BQUFNLFFBQUEsSUFBQU4sT0FBQU8sVUFBQTs7O2lCQUxBO0FBU0EsaUJBckJBLEVBcUJBLEVBckJBLENBQUE7QUFzQkE7QUFDQSxTQTVCQTs7QUE4QkFkLG9CQUFBLFVBQUFHLElBQUEsRUFBQTtBQUNBdkMsb0JBQUFDLEdBQUEsQ0FBQXNDLElBQUE7QUFDQTNELG1CQUFBTSxjQUFBLENBQUFzRCxTQUFBLEdBQUFELEtBQUFFLE1BQUEsQ0FBQSxVQUFBQyxJQUFBLEVBQUFDLE1BQUEsRUFBQTNCLENBQUEsRUFBQTtBQUNBLHlCQUFBNEIsVUFBQSxHQUFBOztBQUVBLHdCQUFBRCxPQUFBRSxTQUFBLEtBQUEsdUNBQUEsRUFBQTtBQUNBLCtCQUFBRixPQUFBRSxTQUFBO0FBQ0EscUJBRkEsTUFFQTtBQUNBLCtCQUFBLG1DQUFBO0FBQ0E7QUFDQTtBQUNBLHVCQUFBSCxPQUFBO21DQUNBQyxPQUFBRyxFQUFBOzZDQUNBOUIsQ0FBQTtnQ0FDQTRCLFlBQUE7OENBQ0FELE9BQUFJLFNBQUE7bURBQ0FKLE9BQUFSLFlBQUEsd0JBQUFRLE9BQUFLLEtBQUEsV0FBQUwsT0FBQU0sUUFBQSxJQUFBTixPQUFBTyxVQUFBOzs7aUJBTEE7QUFTQSxhQWxCQSxFQWtCQSxFQWxCQSxDQUFBO0FBbUJBLFNBbkRBOztBQXFEQXJCLG9CQUFBLFVBQUFVLElBQUEsRUFBQTtBQUNBdkMsb0JBQUFDLEdBQUEsQ0FBQXNDLElBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBM0VBLEtBQUE7O0FBK0VBbEQsUUFBQUMsSUFBQTtBQUNBLENBMU5BIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAvL2tvb3AgaHV1ciBvZiBuaWV1Ym91d1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGJhc2VVcmw6ICdodHRwOi8vZnVuZGEua3lyYW5kaWEubmwvZmVlZHMvQWFuYm9kLnN2Yy9qc29uLycsXG4gICAgICAgIHpvZWtJbnB1dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJJbnB1dCcpLFxuICAgICAgICBrYW1lcnM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdrYW1lcnMnKSxcbiAgICAgICAgb3ZlcnZpZXdQYWdpbmE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVydmlldy1yZXN1bHRzJyksXG4gICAgICAgIGRldGFpbFBhZ2luYTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RldGFpbC1yZXN1bHRzJyksXG4gICAgICAgIHN1Z2dlc3RpZXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWdnZXN0aW9uLXJlc3VsdHMnKVxuXG4gICAgfTtcblxuICAgIC8vIHZhciBkYXRhID0gW107XG4gICAgdmFyIGFwcCA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLnNlYXJjaElucHV0KCk7XG4gICAgICAgICAgICBjb250cm9sbGVyLmluaXQoKTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIua2FtZXJzKCk7XG4gICAgICAgICAgICByb3V0ZXMuaW5pdCgpO1xuICAgICAgICAgICAgbW9kZWwuZGV0YWlsUXVlcnkoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJvdXRlcyA9IHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJvdXRpZSh7XG4gICAgICAgICAgICAgICAgJyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjb3ZlcnZpZXcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBhdGgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ292ZXJ2aWV3JzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYWdlIGlzICcgKyB0aGlzLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzZWN0aW9ucy50b2dnbGUoJyMnICsgdGhpcy5wYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWwubG9hZDEuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAnc2VhcmNoLzpkZXRhaWwnOiBmdW5jdGlvbihkZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BhZ2UgaXMgJyArIHRoaXMucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLmRldGFpbFF1ZXJ5KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNlY3Rpb25zLnRvZ2dsZSgnIycgKyB0aGlzLnBhdGggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJycpIHtcbiAgICAgICAgLy8gICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjaG9tZSc7XG4gICAgICAgIC8vICAgICAgICAgLy8gdGhpcy5kZXRhaWxzKCdoZWxsbycpO1xuICAgICAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSxcblxuICAgICAgICAvLyBkZXRhaWxzOiBmdW5jdGlvbihvYmplY3RJZCkge1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2cob2JqZWN0SWQpO1xuICAgICAgICAvLyAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI2hvbWUnICsgXCIvXCIgKyBvYmplY3RJZDtcbiAgICAgICAgLy8gICAgIC8vIG1vZGVsLmRldGFpbFF1ZXJ5KCk7XG5cbiAgICAgICAgLy8gfVxuXG4gICAgfTtcbiAgICB2YXIgY29udHJvbGxlciA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICAgICAgbW9kZWwub3ZlcnZpZXdRdWVyeSgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZWFyY2hJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtZm9ybScpO1xuXG4gICAgICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIG1vZGVsLm92ZXJ2aWV3UXVlcnkoY29uZmlnLnpvZWtJbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBrYW1lcnM6IGZ1bmN0aW9uKGdldFJvb21zLCBmb3JtVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IFwiaGVlbC1uZWRlcmxhbmRcIjtcblxuICAgICAgICAgICAgY29uZmlnLmthbWVycy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICAgICAgbW9kZWwuZmlsdGVyS2FtZXIoZ2V0Um9vbXMsIGNvbmZpZy5rYW1lcnMudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG1vZGVsID0ge1xuICAgICAgICBvdmVydmlld1F1ZXJ5OiBmdW5jdGlvbih1c2VyUXVlcnksIGkpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJRdWVyeSk7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBwcmljZSA9IFtdO1xuXG4gICAgICAgICAgICBhamEoKS51cmwoY29uZmlnLmJhc2VVcmwgKyBhcGlLZXkudmFsdWUgKyAnLz90eXBlPWtvb3Amem89LycgKyB1c2VyUXVlcnkgKyAnLyZwYWdlPTEmcGFnZXNpemU9MjUnKS5vbignc3VjY2VzcycsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyUXVlcnkpO1xuICAgICAgICAgICAgICAgIHZhciBteVF1ZXJ5ID0gdXNlclF1ZXJ5O1xuICAgICAgICAgICAgICAgIHZhciBteWRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIua2FtZXJzKG15ZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlci5wcmlqcyhteWRhdGEpO1xuICAgICAgICAgICAgICAgIHZpZXcuaG9tZU92ZXJ2aWV3KGRhdGEpO1xuICAgICAgICAgICAgfSkuZ28oKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXRhaWxRdWVyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2NhdGlvbi5oYXNoKTtcblxuICAgICAgICAgICAgYWphKCkudXJsKGNvbmZpZy5iYXNlVXJsICsgJy9kZXRhaWwvJyArIGFwaUtleS52YWx1ZSArICcva29vcC8nICsgJzY0MzMzNWM4LTM4MGYtNDM1MC1iMGRmLWRmZjViNmRhMTU3MycpLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBteVF1ZXJ5ID0gdXNlclF1ZXJ5O1xuICAgICAgICAgICAgICAgIC8vIHZhciBteWRhdGEgPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlci5wcmlqcyhteWRhdGEpO1xuICAgICAgICAgICAgICAgIHZpZXcuZGV0YWlsUGFnZShkYXRhKTtcbiAgICAgICAgICAgIH0pLmdvKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlsdGVyS2FtZXI6IGZ1bmN0aW9uKGRhdGEsIHJvb21zKSB7XG4gICAgICAgICAgICB2YXIga2FtZXJzMiA9IE51bWJlcihyb29tcyk7XG4gICAgICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRLYW1lcnMoa2FtZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrYW1lcnMuQWFudGFsS2FtZXJzID49IGthbWVyczI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGthbWVycy5BYW50YWxLYW1lcnMgPj0ga2FtZXJzMik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmRhdGEgPSBkYXRhLk9iamVjdHMuZmlsdGVyKGdldEthbWVycyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmlldy5maWx0ZXJkYXRhKGZpbHRlcmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLy9lczYgdGVtcGxhdGUgbGl0dGVyYWxcbiAgICB2YXIgdmlldyA9IHtcbiAgICAgICAgaG9tZU92ZXJ2aWV3OiBmdW5jdGlvbihpbmZvKSB7XG5cbiAgICAgICAgICAgIGlmIChpbmZvICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgICAgIGNvbmZpZy5vdmVydmlld1BhZ2luYS5pbm5lckhUTUwgPSBpbmZvLk9iamVjdHNcblxuICAgICAgICAgICAgICAgICAgICAvLyBWb2VnIGVsa2Ugc3RyaW5nIHNhbWVuIHRvdCAxIGdyb3RlIHN0cmluZyA+IDwgZGl2ID4gTmFhbSA8IC9kaXY+PGRpdj5OYWFtPC9kaXYgPlxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGh0bWwsIG9iamVjdCwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW1hZ2VDaGVjaygpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QuRm90b0xhcmdlICE9PSAnL2ltZy90aHVtYnMvdGh1bWItZ2Vlbi1mb3RvX2dyb290LmdpZicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5Gb3RvTGFyZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcuLi9maWxlcy9pbWcvYmFja2dyb3VuZF9ibGFjay5zdmcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBodG1sICsgYFxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjZGV0YWlscy8ke29iamVjdC5JZH1cIj5cbiAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwia3Vuc3R3ZXJrJHtpfSBrdW5zdHdlcmtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ltYWdlQ2hlY2soKX1cIiBhbHQ9XCJ7e0FkcmVzfX1cIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm9iamVjdC1pbmZvXCI+4oKsJHtvYmplY3QuS29vcHByaWpzfSBrLms8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwib2JqZWN0LWluZm9cIj48c3Bhbj4ke29iamVjdC5BYW50YWxLYW1lcnN9IGthbWVyczwvc3Bhbj4gPHNwYW4+JHtvYmplY3QuQWRyZXN9PC9zcGFuPiAke29iamVjdC5Qb3N0Y29kZX0gJHtvYmplY3QuV29vbnBsYWF0c30gPC9wPlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICAgICAgICAgIH0sICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaWx0ZXJkYXRhOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgICAgICAgICAgIGNvbmZpZy5vdmVydmlld1BhZ2luYS5pbm5lckhUTUwgPSBpbmZvLnJlZHVjZShmdW5jdGlvbihodG1sLCBvYmplY3QsIGkpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbWFnZUNoZWNrKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QuRm90b0xhcmdlICE9PSAnL2ltZy90aHVtYnMvdGh1bWItZ2Vlbi1mb3RvX2dyb290LmdpZicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3QuRm90b0xhcmdlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcuLi9maWxlcy9pbWcvYmFja2dyb3VuZF9ibGFjay5zdmcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBodG1sICsgYFxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2VhcmNoLyR7b2JqZWN0LklkfVwiPlxuICAgICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJrdW5zdHdlcmske2l9IGt1bnN0d2Vya1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aW1hZ2VDaGVjaygpfVwiIGFsdD1cInt7QWRyZXN9fVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwib2JqZWN0LWluZm9cIj7igqwke29iamVjdC5Lb29wcHJpanN9IGsuazwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJvYmplY3QtaW5mb1wiPjxzcGFuPiR7b2JqZWN0LkFhbnRhbEthbWVyc30ga2FtZXJzPC9zcGFuPiA8c3Bhbj4ke29iamVjdC5BZHJlc308L3NwYW4+ICR7b2JqZWN0LlBvc3Rjb2RlfSAke29iamVjdC5Xb29ucGxhYXRzfSA8L3A+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH0sICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXRhaWxQYWdlOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgICAgICAgICAgIC8vIGNvbmZpZy5vdmVydmlld1BhZ2luYS5pbm5lckhUTUwgPSBpbmZvXG4gICAgICAgICAgICAvLyAgICAgLnJlZHVjZShmdW5jdGlvbihodG1sLCBvYmplY3QsIGkpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gaW1hZ2VDaGVjaygpIHtcblxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKG9iamVjdC5Gb3RvTGFyZ2UgIT09ICcvaW1nL3RodW1icy90aHVtYi1nZWVuLWZvdG9fZ3Jvb3QuZ2lmJykge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3QuRm90b0xhcmdlO1xuXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiAnLi4vZmlsZXMvaW1nL2JhY2tncm91bmRfYmxhY2suc3ZnJztcblxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBodG1sICsgYFxuICAgICAgICAgICAgLy8gICAgICAgPHNlY3Rpb24gY2xhc3M9XCJrdW5zdHdlcmske2l9IGt1bnN0d2Vya1wiPlxuICAgICAgICAgICAgLy8gICAgICAgICA8aW1nIHNyYyA9ICR7aW1hZ2VDaGVjaygpfT48L2ltZz5cbiAgICAgICAgICAgIC8vICAgICAgICAgPHAgY2xhc3M9XCJvYmplY3QtaW5mb1wiPuKCrCR7b2JqZWN0Lktvb3Bwcmlqc30gay5rPC9wPlxuICAgICAgICAgICAgLy8gICAgICAgICA8cCBjbGFzcz1cIm9iamVjdC1pbmZvXCI+PHNwYW4+JHtvYmplY3QuQWFudGFsS2FtZXJzfSBrYW1lcnM8L3NwYW4+IDxzcGFuPiR7b2JqZWN0LkFkcmVzfTwvc3Bhbj4gJHtvYmplY3QuUG9zdGNvZGV9ICR7b2JqZWN0Lldvb25wbGFhdHN9IDwvcD5cbiAgICAgICAgICAgIC8vICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIC8vICAgICBgO1xuICAgICAgICAgICAgLy8gICAgIH0sICcnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGFwcC5pbml0KCk7XG59KSgpO1xuIl19
