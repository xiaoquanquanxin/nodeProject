var express = require("express");

var homePage = express();


var dirNameIndex = __dirname.lastIndexOf("\\");
var appIndex = __dirname.substring(0, dirNameIndex + 1);


homePage.sendHomePage = function (req, res) {
    res.sendfile(appIndex + "index.html");
    console.log("正确的index.html");
};

homePage.get("/index.html", homePage.sendHomePage);

homePage.btn1 = function (req, res, next) {
    console.log("第一步");
    next()
};
homePage.btn2 = function (req, res) {
    console.log("第二步")
    console.log("对于同一个响应，一个header建立并发送后，不能建立另一个header");
    res.send("天才第二步")
};
homePage.get("/btn", [homePage.btn1, homePage.btn2]);


module.exports = homePage;
