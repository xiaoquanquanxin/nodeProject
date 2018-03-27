var express = require("express");
var routes = express.Router();



//  给路由设置一个中间件，监控请求时间
routes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});
var homePage = require("./homePage");
routes.use("/homePage", homePage);

var dataPage = require("./dataPage");
routes.use("/dataPage", dataPage);




module.exports = routes;


//  重定向
//res.redirect("/homePage/index.html");