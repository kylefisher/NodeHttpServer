function VehiclesViewModel(repository, configuration, cookie) {
    var self = this;
    self.repository = repository;
    self.cookie = cookie;

    self.warningMinutes = configuration.warningMinutes;
    self.criticalMinutes = configuration.criticalMinutes;
    self.refreshInterval = configuration.refreshInterval;

    self.lastRefreshDateTime = ko.observable('');

    // added for configuration
    self.configured = ko.observable(false);
    self.expireConfiguration = ko.observable(false);
    self.selectedLocation = ko.observable(undefined);
    self.restrictedStation = ko.observable(undefined);
    self.locations = ko.observableArray([]);

    self.saveConfiguration = function() {
        self.configured(true);

        self.cookie.locationId = self.selectedLocation();
        self.cookie.stationId = self.restrictedStation();
        self.cookie.neverExpire = self.expireConfiguration();
        self.cookie.save();
    }

    self.loadConfiguration = function() {
        self.cookie.load();

        if (self.cookie.exists) {
            self.configured(self.cookie.exists);
            self.selectedLocation(self.cookie.locationId);
            self.restrictedStation(self.cookie.stationId);
        }
    }

    self.updateLocations = function(locations) {
        self.locations.removeAll();

        for (var i = 0; i < locations.length; i++) {
            self.locations.push(locations[i]);
        }
    }

    //
    // Error handling for view model
    //
    self.errorMessage = ko.observable(undefined);

    self.showError = function(error) {
        self.errorMessage(error);
    }

    self.hideError = function() {
        if (self.errorMessage() !== undefined) {
            self.repository.getStationList(self.updateStations);
            self.updateModel();
            self.errorMessage(undefined);
        }
    }

    //
    // Station View Model
    //
    self.selectedStation = ko.observable('');
    self.stations = ko.observableArray([]);

    self.addStation = function(station) {
        self.stations.push(station);
    }

    self.updateStations = function(stations) {
        var selected = self.selectedStation();

        self.stations.removeAll();

        for (var i = 0; i < stations.length; i++) {
            self.stations.push(stations[i]);
        }

        if (self.stations().some(function(item) { return (item.id === selected); })) {
            self.selectedStation(selected);
        }
    };

    //
    // Vehicle View Model
    //
    self.selectedVehicle = ko.observable(undefined);
    self.vehicles = ko.observableArray([]);

    self.selectVehicle = function(vehicle) {
        self.selectedVehicle(vehicle)
    }

    self.setLoaded = function(vehicle) {
        self.repository.setVehicleLoaded(vehicle, self.selectedStation());
        self.removeVehicle(vehicle);
    }

    self.setCheckOut = function(vehicle) {
        self.repository.setVehicleCheckOut(vehicle);
        self.removeVehicle(vehicle);
    }

    self.setCancel = function(vehicle) {
        self.selectedVehicle(undefined);
    }

    self.addVehicle = function(vehicle) {
        if (vehicle.time() > self.criticalMinutes) {
            vehicle.timeStyle('critical');
        }
        else if (vehicle.time() > self.warningMinutes) {
            vehicle.timeStyle('warning');
        }

        self.vehicles.push(vehicle);
    }

    self.removeVehicle = function(vehicle) {
        self.vehicles.remove(function(item) {
            return item.id === vehicle.id && item.carrierId === vehicle.carrierId;
        });

        if (self.selectedVehicle() === vehicle) {
            self.selectedVehicle(undefined);
        }
    }

    self.updateVehicles = function(vehicles) {
        self.vehicles.removeAll();
        for (var i = 0; i < vehicles.length; i++) {
            //self.removeVehicle(vehicles[i]);
            self.addVehicle(vehicles[i]);
        }

        self.vehicles.sort(function (left, right) {
           return left.time() <= right.time() ? 1 : -1;
        });

        self.lastRefreshDateTime(new Date().toLocaleString());
    }

    self.filteredVehicles = ko.computed(function() {
        return ko.utils.arrayFilter(self.vehicles(), function(vehicle) {
            return (self.selectedStation() === '' || self.selectedStation() === vehicle.loadStation);
        })
    });

    self.averageTime = ko.computed(function() {
        if (self.filteredVehicles().length == 0)
            return 0;

        var totalTime = 0;
        for (var i=0; i < self.filteredVehicles().length; i++) {
            totalTime += self.filteredVehicles()[i].time();
        }

        return Math.round(totalTime / self.filteredVehicles().length);
    });

    //
    // Common
    //
    self.updateModel = function() {
        self.repository.getVehiclesToLoad(self.selectedStation(), self.updateVehicles);
    }

    //
    // Initialization of view model
    //
    self.repository.setOnError(self.showError);
    self.repository.setOnSuccess(self.hideError);

    self.loadConfiguration();

    self.repository.getLocations(self.updateLocations);
    self.repository.getStationList(self.updateStations);
    self.repository.getVehiclesToLoad('', self.updateVehicles);
    setInterval(self.updateModel, self.refreshInterval);
}