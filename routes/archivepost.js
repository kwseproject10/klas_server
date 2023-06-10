const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /noticepost?lectureID=*&noticeID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
    const lectureID = req.query.lectureID;

    // Check if lectureID is NaN and set it to null
    if (lectureID === "NULL") {
        lectureID = null;
    }

  /* {강의 ID와 자료실 게시물 ID 보내면 자료실 게시물 상세정보 반환
      name: "중간고사 결과 공지",
      poster: "박철수",
      postDate: "2020.06.08(목) 20:32",
      postHit: "10",
      postfileURL: "http://...",
      postText: `중간고사 결과를 첨부와 같이 공지 합니다. 

이의신청은 6월 7일 수요일 오전 9시~9시 50분 사이에 915호에서 진행됩니다. `,
}*/
  const query =
    "";

  connection.query(query, [lectureID], (err, results) => {
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