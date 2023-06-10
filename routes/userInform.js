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
    "select u.userName, u.userType, m.majorName as major, u.userID as ID, s.grade, s.semesterNum as numberOfTerm, u.email, u.phone as phoneNum, u.birth as birthday, (SELECT u.userName where u.userID = s.advisor) as advisor, (SELECT u.email where u.userID = s.advisor) as advisorEmail, (SELECT u.tel where u.userID = s.advisor) as advisorNum, s.state FROM users AS u left JOIN majors AS m ON u.majorID = m.majorID left JOIN students AS s ON u.userID = s.advisor where u.userID = ?;";

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      const result = results[0];
      const response = {
        name: result.userName || "",
        type: result.userType || "",
        major: result.major || "",
        ID: result.ID || "",
        grade: result.grade || "",
        numberOfTerm: result.numberOfTerm || "",
        email: result.email || "",
        phoneNum: result.phoneNum || "",
        birthday: result.birthday || "",
        advisor: result.advisor || "",
        advisorEmail: result.advisorEmail || "",
        advisorNum: result.advisorNum || "",
        state: result.state || "",
      };
      res.json(response);
    } else {
      // 데이터가 없는 경우
      const response = {
        result: "no data",
      };
      return res.json(response);
    }
  });
});

module.exports = router;
