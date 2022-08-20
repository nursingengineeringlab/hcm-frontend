module.exports = global.config = {
    //most of those port does not need to be changed.
    http_public_url: "https://nelab.ddns.umass.edu/backend/",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "9001" + "/mqtt",
    data_fetcher_http_url: "https://nelab.ddns.umass.edu/",
    dashboardHeaders: new Headers()
};