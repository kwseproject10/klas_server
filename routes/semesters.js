const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query =
    "select distinct lecYear, lecSem as semester from enrollments as e join lectures as l on e.lecKey = l.lecKey where e.userID = ? ORDER BY lecYear DESC, lecSem DESC";
  /*
lecYear,lecSem
2022,1
2021,2
2021,1
2020,2
*/

  // /semesters?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const semesterInfo = results.map((row) => [
        row.lecYear || null,
        row.semester || null,
      ]);

      console.log(semesterInfo);

      return res.json(semesterInfo);
    } else {
      console.log("semesters Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
