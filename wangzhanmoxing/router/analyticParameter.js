var express = require("express");
var analyticP = express();

//  向前端返回错误信息
analyticP.returnRequestError = function (msg) {
    return {msg: msg, status: "error"};
};

//  get请求的参数转换
analyticP.urlGetParams = function (str) {
    var obj = {};
    var objListArr = str.split("&");
    objListArr.forEach(function (t, index) {
        var oKey = t.split("=")[0];
        var oValue = t.split("=")[1];
        obj[oKey] = oValue;
    });
    return obj
};

//  数据类型转换
analyticP.conversionDataType = function (data) {
    for (var key in data) {
        if (!isNaN(Number(data[key]))) {
            data[key] = Number(data[key]);
        }
    }
    return data;
};



module.exports = analyticP;