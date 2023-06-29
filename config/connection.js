const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '904493',
    database: 'workplace_db'
});

connection.connect();

module.exports = connection;