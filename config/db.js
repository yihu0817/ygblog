const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'b123',
    database: 'nodesql',
});

/**
 * 数据库连接池
 * @param {string} sql sql语句
 * @param {Array} parameter 参数
 * @param {object} callback  回调函数
 * @returns {object} 连接对象.
 */
function query (sql, parameter, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, parameter, function (qerr, vals, fields) {
                // 事件驱动回调
                callback(qerr, vals, fields);
                // 释放连接
                conn.release();
            });
        }
    });
}
module.exports = query;