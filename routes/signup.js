const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /signup
router.post("/", (req, res) => {
  // 쿼리 파라미터 추출
    const userinform = {
        "studentID" : req.body.studentID,
        "password" : req.body.password,
        "rePassword" : req.body.rePassword,
        "name" : req.body.name,
        "phoneNum1" : req.body.phoneNum1,
        "phoneNum2" : req.body.phoneNum2,
        "phoneNum3" : req.body.phoneNum3,
        "birthYear" : req.body.birthYear,
        "birthMonth" : req.body.birthMonth,
        "birthDay" : req.body.birthDay,
        "EmailID" : req.body.EmailID,
        "EmailDomain" : req.body.EmailDomain,
        "checkInformPolicy" : req.body.checkInformPolicy,
    }

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
    const query =
        "";

    connection.query(query, [userinform], (err, results) => {
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
});
module.exports = router;
