var express = require("express");
var routes = express.Router();

var homePage = require("./homePage");
routes.use("/homePage", homePage);

var dataPage = require("./dataPage");
routes.use("/dataPage", dataPage);

//  404
routes.get("/*", function (req, res, next) {
    res.send("404");
});


module.exports = routes;


