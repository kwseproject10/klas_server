const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /enrolllecture?userID=*&lectureID=*
router.post("/", (req, res) => {
  // 쿼리 파라미터 추출
  //const userID = parseInt(req.body.userID);
  //const lectureID = req.body.lectureID;

  // Check if userID is NaN and set it to null
  const data = req.body;
  /*if (isNaN(data.userID)) {
    userID = null;
  }
  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }*/  

  // 유저 ID와 강의 ID 보내면 해당 유저 수강 강의 추가(수강 신청) -> true를 정의하려면 뭔갈 보내줘야함
  const query =
    "";

  connection.query(query, data, (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과 전송
      const response = {
        result: true
      };
      res.json(response);
    } else {
      // 수강 실패 실패
      const response = {
        result: false,
      };
      res.json(response);
    }
  });
});

module.exports = router;
