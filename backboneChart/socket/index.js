/**
 * socket相关处理
 * @param io
 * @param app
 */

module.exports = {
    "startServer": function (io, app) {
        io.listen(app.listen(app.get('port')));
    }
};
