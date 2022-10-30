module.exports = global.config = {
    //most of those port does not need to be changed.
    // http_public_url: "https://nelab.ddns.umass.edu/backend/",
    http_public_url: "http://localhost:8000/backend/",
    // mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848/mqtt",
    mqtt_url: "ws://localhost" + ":" + "30848/mqtt",
    //  data_fetcher_http_url: "https://nelab.ddns.umass.edu/",
    data_fetcher_http_url: "https://localhost/",
    dashboardHeaders: new Headers()
};
