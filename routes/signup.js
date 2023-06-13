const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

/*
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

// /signup
router.post("/", (req, res) => {
  const data = req.body;

  const query1 = "select * from users where userID=?";
  const query2 = "";

  //
  connection.query(query1, data.studentID, (error, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else {
      if (results.length > 0) {
        // 이미 존재하는 학생 ID인 경우
        console.log("이미 존재하는 학생 ID입니다.");
        res.json({ result: false });
      } else {
        connection.query(query2, data, (error, results) => {
          if (error) {
            console.error("MySQL 저장 실패:", error);
            res.json({ result: false });
          } else {
            console.log("MySQL 저장 성공:", results);
            res.json({ result: true });
          }
        });
      }
    }
  });
});
module.exports = router;
