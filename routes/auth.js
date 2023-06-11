const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

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
    "SELECT userID,pw,userType FROM users as u where userID = ? and pw = ?";
  /*
userID,pw,userType
2020123456,1,student
*/

  // /auth?userID=*&PW=*
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

      console.log(response);

      return res.json(response);
    } else {
      // 결과가 없는 경우 "false" 값을 가진 result 응답으로 전송
      const response = {
        result: "false",
      };

      return res.json(response);
    }
  });
});

module.exports = router;
