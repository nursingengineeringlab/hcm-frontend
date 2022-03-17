module.exports = global.config = {
    api_port: "8000",
    http_public_url: "http://nelab.ddns.umass.edu",
    mqtt_url: "ws://nelab.ddns.umass.edu:8083/mqtt",
    data_fetcher_http_url: "http://nelab.ddns.umass.edu",
    data_fetcher_port: "8888",
    dashboardHeaders: new Headers()
    // other global config variables you wish
};