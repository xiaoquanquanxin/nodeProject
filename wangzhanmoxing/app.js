//引入express模块
var express = require("express");
var url = require('url');
var path = require('path');
//初始化
var app = express();
//  把静态文件访问路径设置为 /static + *** , 相当于本地访问时的 /public + ***
app.use('/static', express.static(path.join(__dirname, 'public')));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

var routes = require("./router/index");
app.use("/", routes);


app.listen(2333, function () {
    console.log("服务器启动成功   192.168.1.57:2333");
});




