var App = function () {
    return {
        pathName: window.location.pathname.substr(1),
        init: function () {
            console.log(11)
        },
        getPortName: function () {
            var pathName = App.pathName;
            var pathNameIndex = pathName.indexOf("\/");
            pathName = pathName.substr(0, pathNameIndex);
            return "/" + pathName
        },
    }
}();
$(document).ready(function () {
    return App;
});
