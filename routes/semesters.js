const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /semesters?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const PW = req.query.PW;

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

/* [ 수강한 학기 반환
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
    "";

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const formattedResults = results.map((row, index) => {
        return [
          row.
          row.lec_id,
        ];
      });
      res.json(response);
    }
  });
});

module.exports = router;
