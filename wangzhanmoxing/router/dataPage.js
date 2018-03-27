var express = require("express");

var dataPage = express();


var dirNameIndex = __dirname.lastIndexOf("\\");
var appIndex = __dirname.substring(0, dirNameIndex + 1);


dataPage.sendDataPage = function (req, res) {
    res.sendfile(appIndex + "dataPage.html");
    console.log("正确的dataPage.html");
};

dataPage.get("/dataPage.html", dataPage.sendDataPage);

dataPage.get("/btn", function (req, res) {
    console.log("数据");
    res.send("数据")
});

module.exports = dataPage;
