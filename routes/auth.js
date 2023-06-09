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

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const password = req.query.PW;

  // MySQL 쿼리를 사용하여 사용자 ID와 비밀번호를 확인
  const query =
    "SELECT ua.user_id, ua.user_pw, up.user_type FROM user_authentications as ua, user_profiles as up where ua.user_id = up.user_id and ua.user_id = ? and ua.user_pw = ?";

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
        userType: results[0].user_type,
      };
      res.json(response);
    }
  });
});

module.exports = router;
