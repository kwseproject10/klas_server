const express = require("express");
const router = express.Router();
const mysqlConnection = require("../modules/mysql");

const connection = mysqlConnection.connection;
// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = router;
