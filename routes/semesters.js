const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /semesters?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* [ 수강한 학기 반환 -> 년도와 학기 묶어서 줘야함
    [
        2023,
        1
    ],
    [
        2022,
        2
    ],
    [
        2022,
        1
    ],
    
]*/
  const query =
    "select distinct u.userID, l.lecYear, l.semester from users as u inner JOIN enrollments AS e ON u.userID = e.studentID inner JOIN lectures as l on e.lecKey = l.lecKey where u.userID = ?;";

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const formattedResults = results.map((row) => [
        row.lecYear !== null ? row.lecYear : null,
        row.semester !== null ? row.semester : null,
      ]);
      res.json(formattedResults);
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
