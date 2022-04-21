module.exports = global.config = {
    //most of those port does not need to be changed.
    http_public_url: "https://nelab-ingress.eastus.cloudapp.azure.com/backend/",
    mqtt_url: "wss://nelab-ingress.eastus.cloudapp.azure.com" + ":" + "9001" + "/mqtt",
    data_fetcher_http_url: "https://nelab-ingress.eastus.cloudapp.azure.com/",
    dashboardHeaders: new Headers()
};