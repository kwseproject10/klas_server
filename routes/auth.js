const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /auth?userID=*&PW=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const PW = req.query.PW;

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  // Check if password is NULL and set it to null
  if (PW === "NULL") {
    PW = null;
  }

  // MySQL 쿼리를 사용하여 사용자 ID와 비밀번호를 확인
  const query =
    "SELECT u.userID, u.pw, u.userType FROM users as u where userID = ? and u.pw = ?";

  connection.query(query, [userID, PW], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const response = {
        result: "true",
        userID: results[0].userID,
        userType: results[0].userType,
      };
      res.json(response);
    } else {
      // 결과가 없는 경우 "false" 값을 가진 result와 빈 문자열 값을 가진 userID와 userType을 응답으로 전송
      const response = {
        result: "false",
        userID: "",
        userType: "",
      };
      res.json(response);
    }
  });
});

module.exports = router;
