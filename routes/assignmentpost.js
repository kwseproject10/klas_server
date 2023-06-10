const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /noticepost?lectureID=*&assignmentID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
    const lectureID = req.query.lectureID;
    const assignmentID = req.query.assignmentID;

    // Check if lectureID is NaN and set it to null
    if (lectureID === "NULL") {
        lectureID = null;
    }
    if (assignmentID === "NULL") {
        assignmentID = null;
    }

  /* 
}*/
  const query =
    "";

  connection.query(query, [lectureID, assignmentID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
        const response = {
            name: results[0].name,
            poster: results[0].poser,
            postDate: results[0].postDate,
            postHit: results[0].postHit,
            postfileURL: results[0].postfileURL,
            postText: results[0].postText,
        };
        res.json(response);
    } else {
      // 강의 찾기 실패
        const response = {
            result: "false",
        };
        res.json(response);
    }
  });
});

module.exports = router;