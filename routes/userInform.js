const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
    // 쿼리 파라미터 추출
    const userID = parseInt(req.query.userID);
  
    // Check if userID is NaN and set it to null
    if (isNaN(userID)) {
      userID = null;
    }
    /* MySQL 쿼리 유저 정보
      name: "홍길동",
      type: "학부생",
      major: "컴퓨터정보공학부",
      ID: "2023123456",
      grade: 4,
      numberOfTerm: 7,
      email: "gildong@gmail.com",
      phoneNum: "010-1234-5678",
      birthday: "1900.01.01",
      advisor: "이기훈",
      advisorEmail: "kihoonlee@kw.ac.kr",
      advisorNum: "02-940-8674",
      state: "재학")*/
    const query =
      "";
  
    connection.query(query, [userID], (err, results) => {
      if (err) {
        console.error("MySQL query error: ", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length > 0) {
        // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
        const response = {
          name: result[0].name,
          type: result[0].type,
          major: result[0].major,
          ID: result[0].ID,
          grade: result[0].grade,
          numberOfTerm: result[0].numberOfTerm,
          email: result[0].email,
          phoneNum: result[0].phoneNum,
          birthday: result[0].birthday,
          advisor: result[0].advisor,
          advisorEmail: result[0].advisorEmail,
          advisorNum: result[0].advisorNum,
          state: result[0].state
        };
        res.json(response);
      } else {
        // 로그인 실패
        const response = {
          result: "false",
        };
        res.json(response);
      }
    });
  });
  

module.exports = router;
