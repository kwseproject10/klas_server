const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

// /enrolllecture?userID=*&lectureID=*
router.get("/", (req, res) => {
  let userID = req.query.userID;
  let lectureID = req.query.lectureID;

  if (userID === "NULL") {
    userID = null;
  }
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query1 =
    "SELECT * FROM enrollments e join lectures l on e.lecKey = l.lecKey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem where userID=? and concat(majID,'-',lecLv,'-',subID,'-',clsNum)=?";

  connection.query(query1, [userID, lectureID], (err, result1) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result1.length > 0) {
      console.log("이미 수강신청된 강의임");

      return res.json({ result: false });
    } else {
      const query2 =
        "select lecKey, lecTime from lectures l where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and concat(majID,'-',lecLv,'-',subID,'-',clsNum)=?";

      connection.query(query2, [lectureID], (err, result2) => {
        if (err) {
          console.error("MySQL query error: ", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        const lecKey = result2[0].lecKey;

        let times = result2.lecTime ? result2.lecTime.split(".") : [];
        let weekday;
        for (let i = 0; i < times.length; i++) {
          if (
            times[i].charAt(0) === "월" ||
            times[i].charAt(0) === "화" ||
            times[i].charAt(0) === "수" ||
            times[i].charAt(0) === "목" ||
            times[i].charAt(0) === "금" ||
            times[i].charAt(0) === "토"
          ) {
            weekday = times[i].charAt(0);
          } else {
            times[i] = weekday + times[i];
          }
        }

        const query3 = "INSERT INTO enrollments (userID, lecKey) values (?,?)";

        connection.query(query3, [userID, lecKey], (err, result3) => {
          if (err) {
            console.error("MySQL 저장 실패:", err);

            res.json({ result: false });
          } else {
            console.log("MySQL 저장 성공:", result3);

            res.json({ result: true });
          }
        });
      });
    }
  });
});

module.exports = router;
