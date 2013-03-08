var VehiclesInPlantCookie = (function() {
    var name = 'vip_cookie';

    var vehiclesInPlantCookie = function() {
        this.load();
    };

    vehiclesInPlantCookie.prototype = {
        constructor: vehiclesInPlantCookie,
        exists: false,
        neverExpire: false,
        locationId: '',
        stationId: '',

        load: function (){
            $.cookie.json = true;
            var cookie = $.cookie(name);

            if (cookie) {
                this.exists = true;
                this.locationId = cookie.locationId;
                this.stationId = cookie.stationId;
            }
        },

        save: function (){
            var cookieJSON = {
                'locationId': this.locationId,
                'stationId' : this.stationId
            };
            $.removeCookie(name);
            $.cookie.json = true;

            var expireDays = this.neverExpire ? 365*10 : 0;
            $.cookie(name, cookieJSON, { expires: expireDays });

            this.exists = true;
        }
    }

    return vehiclesInPlantCookie;
})();

$(document).ready(function () {
    ko.applyBindings(
        new VehiclesViewModel(
            new AjaxRepository(vehiclesInPlantConfig),
            vehiclesInPlantConfig,
            new VehiclesInPlantCookie()));

   $('#container').css('display', 'block');
});

