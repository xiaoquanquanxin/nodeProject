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
                            console.log(data)
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

    var example = $("#example");
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
                        //if (status === "success") {
                        //    layer.msg("添加成功", {time: 1000});
                        //    renderData(data);
                        //    layer.close(index);
                        //} else {
                        layer.msg(data.msg, {time: 1000, anim: 6});
                        //}
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
    example.on("mouseenter", "tbody>tr", function () {
        $(this).addClass("success").siblings().removeClass("success");
    }).on("mouseleave", function () {
        $(this).find("tr").removeClass("success");
    }).on("click", "tbody>tr", function () {
        $(this).addClass("warning").siblings().removeClass("warning");
        btnGroup.del.data("id", $(this).data("id"));
        btnGroup.mod.data("id", $(this).data("id"));
    });

    function renderData(data) {
        // debugger
        //  排序
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "html-percent-pre": function (a) {
                var x = String(a).replace(/<[\s\S]*?>/g, "");    //去除html标记
                x = x.replace(/&amp;nbsp;/ig, "");                   //去除空格
                x = x.replace(/%/, "");                          //去除百分号
                return parseFloat(x);
            },

            "html-percent-asc": function (a, b) {                //正序排序引用方法
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "html-percent-desc": function (a, b) {                //倒序排序引用方法
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            }
        });
        if (tDateTable) {
            tDateTable.destroy();
        }
        var tbody = example.find("tbody");
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
            tr.attr("id", t.id);
            tr.attr("title", t.id);
            tbody.append(tr)
        });
        caption.find("span").html(caption.data("html"));
        tDateTable = table.DataTable({
            pagingType: "full_numbers",     //分页样式
            scrollY: Math.min(308, $(document).height() / 2 - 50),                   //垂直滚动条
            scrollCollapse: false,          //滚动条随数据条数变化
//            stateSave: true,                //保存当前状态
            aLengthMenu: [[10, 25, 50, -1], [10, 25, 50, "全部"]],   //  显示数量
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
            "aoColumnDefs": [
                {"sType": "html-percent", "aTargets": [0]},    //指定列号使用自定义排序
            ],
        });
        hiddenXs();
        paginateHiddenXs()
    }

    $(window).on("resize", function () {
        tDateTable.draw(false);tDateTable.on("draw", paginateHiddenXs);
    });
    // renderData([]);
    paginateHiddenXs();

    function paginateHiddenXs() {
        $(".paginate_button.first").addClass("hidden-xs");
        $(".paginate_button.last").addClass("hidden-xs");
    }

    function hiddenXs() {
        $("#tbody").find("tr").each(function (t, index) {
            var td = $(this).find("td");
            td.eq(2).addClass("hidden-xs");
            td.eq(3).addClass("hidden-xs");
        });
    }
});
var table = $('#example');

var tDateTable;