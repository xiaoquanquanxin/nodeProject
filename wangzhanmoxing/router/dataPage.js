var express = require("express");
var url = require("url");
var dataPage = express();
var analyticP = require("./analyticParameter");
var mongod = require("./mongod");

var dirNameIndex = __dirname.lastIndexOf("\\");
var appIndex = __dirname.substring(0, dirNameIndex + 1);

dataPage.sendDataPage = function (req, res) {
    res.sendfile(appIndex + "dataPage.html");
    // console.log("正确的dataPage.html");
};
dataPage.get("/dataPage.html", dataPage.sendDataPage);

dataPage.get("/btn", function (req, res) {
    console.log("数据");
    res.send("数据")
});


//  增删改查
var insertData = mongod.insertData;
var delData = mongod.delData;
var updateData = mongod.updateData;
var selectData = mongod.selectData;


//创建mongodb客户端
var MongoClient = require("mongodb").MongoClient;
//连接串
var DB_CONN_STR = "mongodb://127.0.0.1:27017/company";
//  查询接口
dataPage.get("/search", function (req, res) {
    var arg = url.parse(req.url).query;
    var obj = analyticP.urlGetParams(arg);
    var data = analyticP.conversionDataType(obj);
    console.log("查询", data,data.teamId );
    if( data.teamId === 0 ){
        data = {};
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //{limit: 3, skip: 3}
        selectData(db, "teamList", data, {}, function (result) {
            if (result.length) {
                // console.log(result[0]);
            }
            res.send(result);
            db.close();
        });
    });
});
//  添加一个人接口
var r3 = express().post("/add", function (req, res, next) {
    // console.log(  req.body);
    if (req.body.name === "") {
        res.send(analyticP.returnRequestError("球员姓名不能为空"));
    } else if (req.body.position === "") {
        res.send(analyticP.returnRequestError("球员位置不能为空"));
    } else {
        next()
    }
}, function (req, res, next) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, "teamList", {}, {}, function (result) {
            var id = result.length + 1;
            db.close();
            next(id);
        });
    })
}, function (id, req, res, next) {
    var data = analyticP.conversionDataType(req.body);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        data.id = id;
        insertData(db, "teamList", data, function () {
            db.close();
            next()
        });
    });
}, function (req, res, next) {
    var teamId = analyticP.conversionDataType(req.body).teamId;
    var data = {teamId: teamId};
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, "teamList", data, function (result) {
            if (result.length) {
                // console.log(result[0]);
            }
            result.status = "success";
            res.send(result);
            db.close();
        });
    });
});

var r1 = express.Router();
r1.post('/add', function (req, res, next) {
    console.log("r1");
    console.log(req.baseUrl);
    next();
})

var r2 = express.Router();
r2.post('/add', function (req, res, next) {
    console.log("r2")
    next();
})

dataPage.use(r1, r2, r3);
module.exports = dataPage;
