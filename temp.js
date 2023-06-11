const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /wholenotice?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query =
    "select b.title, s.subjectName as lecName, b.boardDate as noticeDate from enrollments as e left join boards as b on e.lecKey = b.lecKey join lectures as l on e.leckey = l.leckey join subjects as s on l.subjectID = s.subjectID where b.boardType='notice' and e.studentID = ?;";

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const noticeInfo = results.map((row, index) => {
        return {
          key: index.toString(),
          title: row.title !== null ? row.title : null,
          subject: row.lecName !== null ? row.lecName : null,
          date: row.noticeDate !== null ? row.noticeDate : null,
        };
      });

      console.log(noticeInfo);

      // 성공 시 결과 응답으로 전송
      res.json(noticeInfo);
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
