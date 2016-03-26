define("geoService", [
    "vendor"
], function (vendor) {

    var $ = vendor.$;


    return {
        getCity: function (str, callback) {

            var autocomplete = new google.maps.places.AutocompleteService(),
                data = {
                    input: str,
                    types: ['(cities)']
                };


            autocomplete.getPlacePredictions(data, function (res) {
                callback(res);
            });
        },

        getCityCoordinates: function (id, callback) {

            var geocoder = new google.maps.Geocoder;


            geocoder.geocode({
                placeId: id,
                language: 'en'
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    callback(results);
                }
            });
        }
    };
});