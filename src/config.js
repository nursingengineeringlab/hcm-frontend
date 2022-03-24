module.exports = global.config = {
<<<<<<< HEAD
    api_port: "31000",
    http_public_url: "http://nelab.ddns.umass.edu",
    mqtt_url: "ws://nelab.ddns.umass.edu:30848/mqtt",
    data_fetcher_http_url: "http://nelab.ddns.umass.edu",
    // http_public_url: "http://20.231.78.167",
    // mqtt_url: "ws://20.231.78.167:8083/mqtt",
    // data_fetcher_http_url: "http://20.231.78.167",
    data_fetcher_port: "30000",
=======
    cluster_ip: "nelab.ddns.umass.edu",

    //most of those port does not need to be changed.
    api_port: "31000",
    data_fetcher_port: "30000",
    mqtt_port : "30482",
    http_public_url: "http://nelab.ddns.umass.edu",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848" + "/mqtt",
    data_fetcher_http_url: "http://" + "nelab.ddns.umass.edu",
>>>>>>> update config url and port
    dashboardHeaders: new Headers()
};