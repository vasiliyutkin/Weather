define("searchView", [
    "basicEntity",
    "vendor",
    "text!./app/templates/searchTmpl.html",
    "text!./app/templates/citiesTmpl.html",
    "searchCollection",
    "citiesCollection",
    "settingsModel",
    "util"
], function (Entity, vendor, searchTmpl, citiesTmpl, searchCollection, citiesCollection, settingsModel, util) {

    var View = Entity.View,
        $ = vendor.$,
        _ = vendor._;


    var SearchView = View.extend({
        searchTemplate: searchTmpl,
        citiesTemplate: citiesTmpl,
        searchCollection: searchCollection,
        citiesCollection: citiesCollection,
        settings: settingsModel,
        searchState: false,
        initialize: function () {
            this.$el = $('#place-list');
            var self = this;
            this.searchCollection.on('reset clear', this.render, this);
            this.citiesCollection.on('add reset remove clear', this.render, this);
            this.settings.on('change:units', this.render, this);
            this.elements = {
                $input: $('#search-input'),
                $btnAddDel: $('#btn-add-delete'),
                $btnAddSuccess: $('#btn-add-success'),
                $managebar: $('#manage-bar'),
                $settings: $('#settings'),
                $btn: $('#burger-btn'),
                $sidebar: $('#sidebar')

            };
            this.setSizes();
            this.attachEvent();
            this.render();
        },
        render: function () {
            if (this.searchState) {
                this.$el.html(_.template(this.searchTemplate, {cities: this.searchCollection.getCities()}));
            } else {
                this.$el.html(_.template(this.citiesTemplate, {
                    cities: this.citiesCollection.getFormatedData(),
                    settings: this.settings.attributes,
                    toFahrenheit: util.toFahrenheit
                }));
            }
            this.setSizes();
        },
        attachEvent: function () {
            var self = this;

            this.elements.$btn.on('click', function () {
                var lt;
                if (self.elements.$sidebar.attr('data-state') === 'open') {
                    $('#app').removeClass('no-scroll');
                    self.elements.$sidebar.css('left', '100%');
                    lt = '-' +
                        (parseFloat(self.elements.$sidebar.css('paddingLeft')) +
                        parseInt($('html').css('fontSize')) * 3 +
                        parseFloat(self.elements.$btn.css('width'))) + 'px';
                    self.elements.$btn.css({left: lt, zIndex: 500});
                    self.elements.$sidebar.attr('data-state', 'close');
                } else {
                    $('#app').addClass('no-scroll');
                    lt = parseInt(self.elements.$sidebar.css('width')) / $('#app').width() * 100;
                    self.elements.$sidebar.css('left', 100 - lt + '%');
                    self.elements.$btn.css('left', 0);
                    self.elements.$sidebar.attr('data-state', 'open');
                }
            });

            this.elements.$btnAddSuccess.on('click', function () {
                var $el = $(this),
                    $inputs, placesId;
                if (!self.deleteState) {
                    $el.toggleClass('active');
                    self.elements.$input.toggleClass('hidden');
                    self.searchState = !self.searchState;
                    self.render();
                } else {
                    $inputs = self.$el.find('input:checked');
                    placesId = [];
                    $inputs.each(function (i, elem) {
                        placesId.push({
                            placeId: $(elem).attr('data-place-id'),
                            city: $(elem).attr('data-city')
                        });
                    });
                    if ($inputs.length) {
                        self.trigger('deleteCities', placesId);
                        self.elements.$btnAddDel.removeClass('active');
                        self.elements.$btnAddSuccess.removeClass('icon-check').addClass('icon-add');
                        self.deleteState = false;
                    }
                }
            });
            this.elements.$input.on('keyup', function () {
                self.trigger('inputData', $(this).val());
            });

            this.elements.$btnAddDel.on('click', function () {
                var $inputs = self.$el.find('input:checked'),
                    placesId = [];
                $inputs.each(function (i, elem) {
                    placesId.push({
                        placeId: $(elem).attr('data-place-id'),
                        city: $(elem).attr('data-city')
                    });
                });
                if (self.searchState) {
                    if ($inputs.length) {
                        self.trigger('addCitiesById', placesId);
                        self.elements.$btnAddDel.removeClass('icon-check').addClass('icon-delete');
                        self.elements.$btnAddSuccess.removeClass('active');
                        self.searchState = !self.searchState;
                        self.elements.$input.val('');
                        self.trigger('inputData', '');
                        self.elements.$input.toggleClass('hidden');
                    }
                } else if (!$inputs.length && !self.deleteState) {
                    self.deleteState = true;
                    $(this).toggleClass('active');
                    self.$el.find('.check-box').css('visibility', 'visible');
                } else {
                    self.deleteState = false;
                    $(this).toggleClass('active');
                    self.$el.find('.check-box').css('visibility', 'hidden');
                }
            });
            this.$el.on('click', '.input-hidden', function (e) {
                e.stopPropagation();
                if (self.searchState) {
                    if (self.$el.find('input:checked').length) {
                        self.elements.$btnAddDel.removeClass('icon-delete').addClass('icon-check');
                    } else {
                        self.elements.$btnAddDel.removeClass('icon-check').addClass('icon-delete');
                    }
                } else if (self.deleteState && self.$el.find('input:checked').length) {
                    self.elements.$btnAddSuccess.removeClass('icon-add').addClass('icon-check');
                } else {
                    self.elements.$btnAddSuccess.removeClass('icon-check').addClass('icon-add');
                }
            });
            this.$el.on('click', '.item', function (e) {
                if (!self.searchState && e.target.className !== "box") {
                    $('#dashboard').flexslider($(this).index());

                }
            });
            this.$el.perfectScrollbar();

        },
        setSizes: function () {

            var state = this.elements.$sidebar.attr('data-state'),
                managebarHeight, settingsHeight, viewportHeight, placeListHeight;

            /*set place-list height*/
            managebarHeight = parseInt(this.elements.$managebar.css('height'));
            settingsHeight = parseInt(this.elements.$settings.css('height'));
            viewportHeight = $(window).height();
            viewportWidth = $(window).width();

            if (viewportHeight !== 414 && viewportWidth !== 736) {
                placeListHeight = viewportHeight - settingsHeight - managebarHeight;
            } else {
                placeListHeight = viewportHeight -  managebarHeight;
            }
            this.$el.css('height', placeListHeight);

            if (state === 'close') {
                /*set burger btn position*/
                var lt = '-' +
                    (parseFloat(this.elements.$sidebar.css('paddingLeft')) +
                    parseInt($('html').css('fontSize')) * 3 +
                    parseFloat(this.elements.$btn.css('width'))) + 'px';
                this.elements.$btn.css({left: lt, zIndex: 500});
            }
            this.$el.perfectScrollbar('update');
        }

    });
    return SearchView;
});