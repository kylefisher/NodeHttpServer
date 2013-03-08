//    <script src="javascripts/jquery.cookie.js" type="text/javascript"></script>

//<!-- Configuration -->
//<!--
//    <form id="clientConfiguration" class="view">
//        <h1>Client Configuration</h1>
//        <label for="locationSelector">Location: <select id="locationSelector" data-bind="options: locations, value: selectedLocation, optionsText: 'description', optionsValue: 'id'"></select></label>
//        <label for="loadStationSelector">Load Station: <select id="loadStationSelector" data-bind="options: stations, value: restrictedStation, optionsText: 'description', optionsValue: 'id'"></select></label>
//        <div class="actions">
//            <input type="button" value="Save" id="saveConfigurationButton" data-bind="click: $root.setLoaded" />
//            <input type="button" value="Cancel" id="cancelConfigurationButton" data-bind="click: $root.setCancel"/>
//        </div>
//    </form>
//-->

$(document).ready(function () {
    var cookie = new vehiclesInPlantCookie();

    if (cookie.exists) {
        startVehiclesInPlant();
    }
    else {
        showClientConfiguration();
    }



    $('#container').css('display', 'block');
});

function startVehiclesInPlant() {
    ko.applyBindings(
        new VehiclesViewModel(
            new AjaxRepository(vehiclesInPlantConfig),
            vehiclesInPlantConfig));
}

function showClientConfiguration() {

}

var vehiclesInPlantCookie = (function() {
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
                this.locationId = self.cookie.locationId;
                this.stationId = self.cookie.stationId;
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
