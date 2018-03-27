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

app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(2333, function () {
    console.log("服务器启动成功  192.168.199.190:2333");
});
//创建mongodb客户端
var MongoClient = require("mongodb").MongoClient;
//连接串
var DB_CONN_STR = "mongodb://127.0.0.1:27017/company";
//  查
var selectData = function (db, collectionName, where, callback) {
    //连接到集合
    var collection = db.collection(collectionName);
    //查询
    collection.find(where).toArray(function (err, result) {
        if (!err) {
            //成功
            callback(result);
        }
        else {
            callback("Error: " + err);
        }
    });
};
//  增加  给哪个数据库增加  插入数据
//                          db  集合名字        增加的文档   回调
var insertData = function (db, collectionName, data, callback) {
    var collection = db.collection(collectionName);
    collection.insert(data, function (err, result) {
        if (!err) {
            //成功
            callback(result);
        }
        else {
            callback("插入数据失败:" + err);
        }
    });
};
//  删除
//                                          删除条件 一般不超过5-7个条件
var delData = function (db, collectionName, where, callback) {
    var collection = db.collection(collectionName);
    collection.remove(where, function (err, result) {
        if (!err) {
            //成功
            callback(result);
        }
        else {
            callback("插入数据失败:" + err);
        }
    });
};
//  改   数据库 集合 条件
//                                          把where  改成update
var updateData = function (db, collectionName, where, update, callback) {
    //连接到集合
    var collection = db.collection(collectionName);
    //修改
    collection.update(where, update, function (err, result) {
        if (!err) {
            //成功
            callback(result);
        }
        else {
            callback("插入数据失败:" + err);
        }
    });
};
//  查询接口
app.get("/search", function (req, res) {
    var arg = url.parse(req.url).query;
    var obj = urlGetParams(arg);
    var data = conversionDataType(obj);
    console.log(data);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, "teamList", data, function (result) {
            if (result.length) {
                // console.log(result[0]);
            }
            res.send(result);
            db.close();
        });
    });
});
//  添加一个人接口
app.post("/add", function (req, res) {
    // console.log(  req.body);
    if (req.body.name === "") {
        res.send(returnRequestError("球员姓名不能为空"));
    } else if (req.body.position === "") {
        res.send(returnRequestError("球员位置不能为空"));
    } else {
        var data = conversionDataType(req.body);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            var length;
            selectData(db, "teamList", {}, function (result) {
                length = result.length + 1;
                addContinue();
            });

            function addContinue() {
                data.id = length;
                insertData(db, "teamList", data, function (result) {
                    result.status = "success";
                    res.send(result);
                    db.close();
                });
            }
        })
    }
});
//  删除接口
app.post("/delete", function (req, res) {
    if (req.body.id) {
        var data = conversionDataType(req.body);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            delData(db, "teamList", data, function (result) {
                var data = {};
                data.status = "success";
                res.send(data);
                db.close();
            });
        })
    } else {
        res.send(returnRequestError("未选中数据!操作失败"));
    }
});
//  查一条数据接口
app.get("/search/modification", function (req, res)  {
    var arg = url.parse(req.url).query;
    var obj = urlGetParams(arg);
    var data = conversionDataType(obj);
    console.log(data);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, "teamList", data, function (result) {
            if (result.length) {
                // console.log(result[0]);
                app.modificationObj = result[0];
            }
            res.send(result);
            db.close();
        });
    });
});
//  修改一条数据接口
app.post("/modification", function (req, res) {
    if (req.body.id) {
        var data = conversionDataType(req.body);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            updateData(db, "teamList", app.modificationObj, {$set: data}, function (result) {
                var data = {};
                data.status = "success";
                res.send(data);
                db.close();
            });
        })
    } else {
        res.send(returnRequestError("未选中数据!操作失败"));
    }
});

//  向前端返回错误信息
function returnRequestError(msg) {
    return {msg: msg, status: "error"};
}

//  get请求的参数转换
function urlGetParams(str) {
    var obj = {};
    var objListArr = str.split("&");
    objListArr.forEach(function (t, index) {
        var oKey = t.split("=")[0];
        var oValue = t.split("=")[1];
        obj[oKey] = oValue;
    });
    return obj
}

//  数据类型转换
function conversionDataType(data) {
    for (var key in data) {
        if (!isNaN(Number(data[key]))) {
            data[key] = Number(data[key]);
        }
    }
    return data;
}