const vehiclesInPlantConfig = {
    // Web service address to retrieve data
    serviceAddress: 'http://ks-kfisher-d01:8111',

    // How frequently to refresh data (in milliseconds)
    refreshInterval: 3000,

    // How long a vehicle has been in plant before displaying a critical warning (in minutes)
    criticalMinutes: 10,

    // How long a vehicle has been in plant before displaying a warning (in minutes)
    warningMinutes: 5,

    // How many times to attempt a failed service call before reporting connection issue.
    errorLimit: 3
};