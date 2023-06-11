const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /signup
router.post("/", (req, res) => {

  const userID = {
    studentID: req.body.studentID,
  }
  const userinform = req.body;

  /* 회원가입 정보 보내면 회원가입 성공한지 반환
  {
            "studentID" : "2020123456",
            "password" : "**123123",
            "rePassword" : "**123123",
            "name" : "홍길동",
            "phoneNum1" : "010",
            "phoneNum2" : "1234",
            "phoneNum3" : "5678",
            "birthYear" : "2000",
            "birthMonth" : "12",
            "birthDay" : "25",
            "EmailID" : "gildong",
            "EmailDomain" : "gmail.com",
            "checkInformPolicy" : "true"
}*/
  const query1 =
    "";

  connection.query(query, userID, (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const response = {
        result: "false",
      };
      // 성공 시 결과 응답으로 전송
      res.json(response);
    }
    else {
      const query2 =
        "";

      connection.query(query2, userinform, (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          const response = {
            result: "true",
          };
          // 성공 시 결과 응답으로 전송
          res.json(response);
        } else {
          // 데이터가 없는 경우
          const response = {
            result: "false",
          };
          res.json(response);
        }
      });
    }
  });

});
module.exports = router;
