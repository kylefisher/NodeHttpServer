function AjaxRepository(configuration) {
    var self = this;
    self.url = configuration.serviceAddress + '/Cai/Apex/Services/Ticket/VehiclesInPlant/';
    self.maxErrors = configuration.errorLimit;
    self.errorCount = 0;
    self.onSuccess = undefined;
    self.onError = undefined;

    self.setOnSuccess = function(callback) {
        self.onSuccess = callback;
    }

    self.setOnError = function(callback) {
        self.onError = callback;
    }

    self.makeServiceCall = function(method, callJSON, callback) {
        $.ajax({
            type: 'POST',
            url: self.url + method,
            data: JSON.stringify(callJSON),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            processData: false,
            success: function(result) {
                callback(result);
                self.serviceCallSucceeded(result);
            },
            error: self.serviceCallFailed
        });
    };

    self.serviceCallSucceeded = function(result) {
        self.errorCount = 0;

        if (self.onSuccess !== undefined) {
            self.onSuccess(result);
        }
    }

    self.serviceCallFailed = function(jqXHR, textStatus, errorThrown) {
        self.errorCount++;

        if (self.errorCount >= self.maxErrors && self.onError !== undefined) {
            self.onError('Service communication has been lost.');
        }
    };

    self.getStationList = function(callback) {
        var serviceCallback = function(result) {
            var stations = result.GetStationsResult.map(function(station) {
                return new Station(station.ID, station.Description);
            });

            callback(stations);
        };

        self.makeServiceCall('GetStations', '', serviceCallback);
    };

    self.getLocations = function(callback) {
        var serviceCallback = function(result) {
          var locations = result.GetLocationsResult.map(function(location) {
              return new Location(location.LocationID, location.Description);
          })

          callback(locations);
        };

        self.makeServiceCall('GetLocations', '', serviceCallback);
    }

    self.getVehiclesToLoad = function(loadStation, callback) {
        var serviceCallback = function(result) {
            var vehicles = result.GetVehiclesToLoadResult.map(function(vehicle) {
                var lastDateTimeIn = self.parseWcfJsonDate(vehicle.LastDateTimeIn);
                var timeIn = (Date.now() - lastDateTimeIn.getTime()) / (60 * 1000);
                return new Vehicle(vehicle, timeIn);
            });

            callback(vehicles);
        };

        var callData = {
            'locationID' : '1',
            'loadStationID' : ''
            //'loadStationID' : (loadStation === undefined) ? '' : loadStation
        };

        self.makeServiceCall('GetVehiclesToLoad', callData, serviceCallback);
    };

    self.setVehicleLoaded = function(vehicle, selectedStation) {
        var splitLoad = (vehicle.isSplitLoad) ? 'Y' : 'N';

        var callData = {
            'carrierID': vehicle.carrierId,
            'vehicleID': vehicle.id,
            'locationID': '1',
            'loadStationID': selectedStation,
            'isSplitLoad': splitLoad
        };

        self.makeServiceCall('SetVehicleToLoadStatus', callData);
    };

    self.setVehicleCheckOut = function(vehicle) {
        var callData = {
            'carrierID': vehicle.carrierId,
            'vehicleID': vehicle.id
        };

        self.makeServiceCall('SetVehicleToInOutStatus', callData);
    };

    self.parseWcfJsonDate = function(jsonDateString) {
        var indexOfOpenParen = jsonDateString.indexOf('(');
        var indexOfCloseParen = jsonDateString.indexOf(')');
        var datePortion = jsonDateString.substring(indexOfOpenParen + 1, indexOfCloseParen);

        return new Date(parseInt(datePortion));
    };
}
