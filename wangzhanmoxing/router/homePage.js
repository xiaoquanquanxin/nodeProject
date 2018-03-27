var express = require("express");

var homePage = express();


var dirNameIndex = __dirname.lastIndexOf("\\");
var appIndex = __dirname.substring(0, dirNameIndex + 1);


homePage.sendHomePage = function (req, res) {
    res.sendfile(appIndex + "index.html");
    console.log("正确的index.html");
};

homePage.get("/index.html", homePage.sendHomePage);

homePage.get("/btn", function (req, res) {
    console.log("abd");
    res.send("abc")
});


module.exports = homePage;
