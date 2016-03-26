define("searchCollection", [
    "basicEntity",
    "cityModel",
    "vendor"
], function (Entity, CityModel, vendor) {

    var Collection = Entity.Collection,
        _ = vendor._,
        SearchCollection = Collection.extend({
            model: CityModel,
            resetCities: function (arr) {
                this.collection.length = 0;
                this.add(arr);
                this.trigger('reset');
            },
            getCities: function () {
                var ret = [];
                _.each(this.collection, function (e) {
                    ret.push(e.attributes);
                });
                return ret;
            }
        });
    return new SearchCollection;
});
