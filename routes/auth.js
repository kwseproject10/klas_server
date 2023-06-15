const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = req.query.userID;
  const PW = req.query.PW;

  // Check if password is NULL and set it to null
  if (userID === "NULL") {
    userID = null;
  }

  // Check if password is NULL and set it to null
  if (PW === "NULL") {
    PW = null;
  }

  // MySQL 쿼리를 사용하여 사용자 ID와 비밀번호를 확인
  const query =
    "SELECT userID,pw,userType FROM users as u where userID = ? and pw = ?";

  /*
userID,pw,userType
2020123456,1,student
*/

  // /auth?userID=*&PW=*
  connection.query(query, [userID, PW], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const authSuccess = {
        result: "true",
        userID: results[0].userID,
        userType: results[0].userType,
      };

      console.log("authSuccess");

      return res.json(authSuccess);
    } else {
      console.log("auth Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
