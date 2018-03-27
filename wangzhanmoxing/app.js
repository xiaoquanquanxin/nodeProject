//引入express模块
var express = require("express");
var url = require('url');
var path = require('path');
var bodyParser = require("body-parser");
var routes = require("./router/index");

//初始化
var app = express();
//  把静态文件访问路径设置为 /static + *** , 相当于本地访问时的 /public + ***
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);
//  错误日志
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


//  404
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
// 指定唯一子网
app.set('trust proxy', 'loopback');
app.locals.title = 'My App';
app.locals.email = 'me@myapp.com';
app.set('port', process.env.PORT || 2345);
var server = app.listen(app.get('port'), function () {
    console.log("服务器启动成功   loopback:" + server.address().port);
    console.log(app.locals.title)
});


function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({error: 'Something blew up!'});
    } else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    res.status(500);
    res.send({error: err});
}
