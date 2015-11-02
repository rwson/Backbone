/**
 * 路由处理
 */

var crypto = require('crypto');

module.exports = {
    /**
     * 生成随机id
     * @returns {string}
     */
    "randomId": function () {
        var S4 = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return [S4(), S4(), S4(), S4(), S4(), S4(), S4(), S4()].join("");
    },

    /**
     * 字符串加密
     * @param str   字符串
     * @returns {*}
     */
    "encryptString": function (str) {
        var sha1 = crypto.createHash("sha1");
        sha1.update("" + str);
        return sha1.digest("hex");
    },

    /**
     * 获取当前时间对象
     */
    "getTime": function () {
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
            day = date.getDate() < 9 ? "0" + date.getDate() : date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes(),
            second = date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds();
        return {
            "year": "" + year,
            "month": year + "-" + month,
            "day": year + "-" + month + "-" + day,
            "minutes": year + "-" + month + "-" + day + " " + hour + ":" + minute,
            "seconds": year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
        };
    }
};