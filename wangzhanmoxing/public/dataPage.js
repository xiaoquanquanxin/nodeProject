$(document).ready(function () {
    var searchTeam = $("button#searchTeam");
    //  球队
    searchTeam.on("click", function () {
        layer.open({
            type: 1,
            title: '<b class="text-info">查找</b>',
//                area: ["500px"],
            btn: ["提交", "取消"],
            content: $("#searchForm"),
            btn1: function (index, layero) {
                var val = caption.searchBtn.val();
                console.log("球队id", val);
                $.ajax({
                    url: App.getPortName() + "/search?teamId=" + val,
                    type: "get",
                    success: function (data, status) {
                        if (status === "success") {
                            renderData(data);
                            layer.close(index);
                        }
                    }
                });
            },
            success: function () {

            }
        })
    });

    var teamTable = $("#teamTable");
    var btnGroup = $("#actionBtnList");
    btnGroup.add = $("button#add");
    btnGroup.del = $("button#del");
    btnGroup.mod = $("button#mod");
    var caption = $("#caption");
    caption.searchBtn = $("#searchForm1");
    caption.searchBtn.on("change", function (e) {
        var option = caption.searchBtn.find("option[value=" + $(this).val() + "]");
        caption.data("html", option.html())
    });
    var addForm = $("#addForm");
    var modificationForm = $("#modificationForm");
    //  增加
    btnGroup.add.on("click", function () {
        layer.open({
            type: 1,
            title: '<b class="text-primary">添加球员</b>',
//                area: ["500px"],
            btn: ["提交", "取消"],
            content: $("#addForm"),
            btn1: function (index) {
                var data = {};
                addForm.find("input").each(function (item, t) {
                    console.log();
                    var key = $(t).attr("data-info");
                    data[key] = $(t).val();
                });
                data.teamId = caption.searchBtn.val();
                $.ajax({
                    url: "add",
                    type: "post",
                    //                        data: {info:JSON.stringify(data),teamId:caption.searchBtn.val()},
                    data: data,
                    success: function (data, status) {
                        console.log(data, status);
                        if (status === "success") {
                            layer.msg("添加成功", {time: 1000});
                            renderData(data);
                            layer.close(index);
                        } else {
                            layer.msg(data.msg, {time: 1000, anim: 6});
                        }
                    }
                })
            },
            success: function () {

            }
        })
    });
    //  删除
    btnGroup.del.on("click", function () {
        var id = $(this).data("id");
        console.log(id)
        if (id) {
            layer.confirm("确认删除此条数据?", {
                btn: ["确定", "取消"],
                btn1: function (index) {
                    $.ajax({
                        url: "delete",
                        type: "post",
                        data: {id: id},
                        success: function (data) {
                            if (data.status === "success") {
                                layer.msg("删除成功", {time: 1000});
                                layer.close(index)
                            } else {
                                layer.msg(data.msg, {time: 1000, anim: 6});
                            }
                        }
                    })
                }
            });
        } else {
            layer.msg("请选中数据", {time: 1000, anim: 6});
        }
    });
    //  修改
    btnGroup.mod.on("click", function () {
        var id = $(this).data("id");
        if (id) {
            var val = caption.searchBtn.val();
            $.ajax({
                url: "/search/modification?teamId=" + val + "&id=" + id,
                type: "get",
                success: function (data, status) {
                    if (status === "success") {
                        console.log(data[0]);
                        modificationForm.find("input").each(function (item, t) {
                            var key = $(t).attr("data-info");
                            $(t).val(data[0][key]);
                            console.log(key)
                        });
                    }
                }
            });
            layer.open({
                type: 1,
                title: '<b class="text-primary">修改球员</b>',
                btn: ["提交", "取消"],
                content: $("#modificationForm"),
                btn1: function (index) {
                    var data = {};
                    modificationForm.find("input").each(function (item, t) {
                        var key = $(t).attr("data-info");
                        data[key] = $(t).val();
                    });
                    data.id = id;
                    $.ajax({
                        url: "modification",
                        type: "post",
                        data: data,
                        success: function (data) {
                            if (data.status === "success") {
                                layer.msg("修改成功", {time: 1000});
                                layer.close(index)
                            } else {
                                layer.msg(data.msg, {time: 1000, anim: 6});
                            }
                        }
                    })
                },
                success: function () {

                }
            })
        } else {
            layer.msg("请选中数据", {time: 1000, anim: 6});
        }
    });
    teamTable.on("mouseenter", "tbody>tr", function () {
        $(this).addClass("success").siblings().removeClass("success");
    }).on("mouseleave", function () {
        $(this).find("tr").removeClass("success");
    }).on("click", "tbody>tr", function () {
        $(this).addClass("warning").siblings().removeClass("warning");
        btnGroup.del.data("id", $(this).data("id"));
        btnGroup.mod.data("id", $(this).data("id"));
    });

    function renderData(data) {
        var tbody = teamTable.find("tbody");
        tbody.html("");
        data.forEach(function (t, index) {
            var tr = $("<tr></tr>");
            tr.data("id", t.id);
            tr.append($("<td>" + t.position + "</td>"));
            var td = $("<td></td>");
            td.append("<span>" + t.name + "</span>");
            if (t.isCaptain) {
                td.append("<span class='badge'>队长</span>")
            }
            tr.append(td);
            tr.append($("<td>" + t.height + "</td>"));
            tr.append($("<td>" + t.weight + "</td>"));
            tr.append($("<td>" + t.yearsexp + "</td>"));
            tr.append($("<td>" + t.number + "</td>"));
            tr.attr("id",t.id);
            tr.attr("title",t.id);
            tbody.append(tr)
        });
        caption.find("span").html(caption.data("html"));
    }
});