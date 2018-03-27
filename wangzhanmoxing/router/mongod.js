var express = require("express");
var mongod = express();


//  查
mongod.selectData = function (db, collectionName, where, callback) {
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
mongod.insertData = function (db, collectionName, data, callback) {
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
mongod.delData = function (db, collectionName, where, callback) {
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
mongod.updateData = function (db, collectionName, where, update, callback) {
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


module.exports = mongod;