module.exports = global.config = {
    cluster_ip: "nelab.ddns.umass.edu",

    //most of those port does not need to be changed.
    api_port: "31000",
    data_fetcher_port: "30000",
    mqtt_port : "30482",
    http_public_url: "http://nelab.ddns.umass.edu/api",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848" + "/mqtt",
    data_fetcher_http_url: "http://" + "nelab.ddns.umass.edu",
    dashboardHeaders: new Headers()
};