module.exports = global.config = {
    api_port: "31000",
    http_public_url: "http://nelab.ddns.umass.edu",
    mqtt_url: "ws://nelab.ddns.umass.edu:30848/mqtt",
    data_fetcher_http_url: "http://nelab.ddns.umass.edu",
    // http_public_url: "http://20.231.78.167",
    // mqtt_url: "ws://20.231.78.167:8083/mqtt",
    // data_fetcher_http_url: "http://20.231.78.167",
    data_fetcher_port: "30000",
    dashboardHeaders: new Headers()
    // other global config variables you wish
};