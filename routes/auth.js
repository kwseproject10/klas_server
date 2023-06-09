// auth.js

const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "5903",
  port: 3306,
  database: "db_klas",
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

router.get("/auth", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const password = req.query.PW;

  // MySQL 쿼리를 사용하여 사용자 ID와 비밀번호를 확인
  const query =
    "SELECT user_id FROM user_authentications WHERE user_id = ? AND user_pw = ?";
  connection.query(query, [userID, password], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const response = {
        result: "true",
        userID: results[0].user_id,
      };
      res.json(response);
    } else {
      // 인증 실패 시 결과를 응답으로 전송
      const response = {
        result: "false",
        message: "Authentication failed",
      };

      res.json(response);
    }
  });
});

module.exports = router;
