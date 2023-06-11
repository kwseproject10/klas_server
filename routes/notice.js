const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /notice?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select b.title,su.subjectName,b.boardDate from lectures as l left join subjects as su on l.subjectID = su.subjectID left join boards as b on l.lecKey = b.lecKey left join users as u on l.lecProfessor= u.userName where concat(l.majorID,'-',l.lecLevel,'-',l.subjectID,'-',l.class) = ?;";
  /*
title,subjectName,boardDate
NULL,융합적사고와글쓰기,NULL
*/
  // /notice?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const noticeList = results.map((row, index) => {
        return {
          key: index.toString(),
          title: row.title,
          subject: row.subjectName,
          date: row.boardDate,
        };
      });

      console.log(noticeList);

      // 성공 시 결과 응답으로 전송
      res.json(noticeList);
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
