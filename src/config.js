module.exports = global.config = {
<<<<<<< HEAD
    cluster_ip: "nelab.ddns.umass.edu",
=======

>>>>>>> 5a0f9618e0bbf005021efeefdf65c91259cbdfbe
    //most of those port does not need to be changed.
    data_fetcher_port: "30000",
    mqtt_port : "30482",
    http_public_url: "https://nelab.ddns.umass.edu/backend/",
    mqtt_url: "wss://nelab.ddns.umass.edu" + ":" + "32729" + "/mqtt",
    data_fetcher_http_url: "http://" + "nelab.ddns.umass.edu",
    dashboardHeaders: new Headers()
};