module.exports = global.config = {
    //most of those port does not need to be changed.
    mqtt_port : "30482",
    http_public_url: "https://nelab.ddns.umass.edu/backend/",
    mqtt_url: "wss://nelab.ddns.umass.edu" + ":" + "32729" + "/mqtt",
    data_fetcher_http_url: "https://" + "nelab.ddns.umass.edu/",
    dashboardHeaders: new Headers()
};