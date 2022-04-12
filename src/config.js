module.exports = global.config = {
    //most of those port does not need to be changed.
<<<<<<< HEAD
    http_public_url: "https://nelab-ingress.eastus.cloudapp.azure.com/backend/",
    mqtt_url: "wss://nelab-ingress.eastus.cloudapp.azure.com/" + ":" + "32729" + "/mqtt",
    data_fetcher_http_url: "https://nelab-ingress.eastus.cloudapp.azure.com/",
=======
    http_public_url: "https://nelab.ddns.umass.edu/backend/",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848" + "/mqtt",
    data_fetcher_http_url: "https://" + "nelab.ddns.umass.edu/",
>>>>>>> revert back to ws
    dashboardHeaders: new Headers()
};