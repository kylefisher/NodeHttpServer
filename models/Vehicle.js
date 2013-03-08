function Vehicle(vehicle, time) {
    var self = this;
    self.id = vehicle.VehicleID;
    self.description = vehicle.VehicleDescription;
    self.carrierId = vehicle.CarrierID;
    self.carrierDescription = vehicle.CarrierDescription;
    self.productId = vehicle.ProductID;
    self.productDescription = vehicle.ProductDescription;
    self.customerId = vehicle.CustomerID;
    self.customerDescription = vehicle.CustomerDescription;
    self.targetWeight = vehicle.TargetWeight;
    self.loadStation = vehicle.LoadStationID;
    self.isSplitLoad = ((vehicle.IsSplitLoad === 'Y') || (vehicle.SplitLoadDispatch === true));

    self.time = ko.observable(time);
    self.timeStyle = ko.observable('');

    self.formattedTime = ko.computed(function() {
        return Math.round(self.time()) + ' m';
    })
}