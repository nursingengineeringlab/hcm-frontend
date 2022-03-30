module.exports = global.config = {

    //most of those port does not need to be changed.
    data_fetcher_port: "30000",
    mqtt_port : "30482",
    http_public_url: "https://nelab.ddns.umass.edu/backend/",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848" + "/mqtt",
    data_fetcher_http_url: "http://" + "nelab.ddns.umass.edu",
    dashboardHeaders: new Headers()
};