const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /postnotice
router.post("/", (req, res) => {

    const notice = req.body;

    /* 공지사항 게시물 작성
    {
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

    connection.query(query, notice, (err, results) => {
        if (err) {
            console.error("MySQL query error: ", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (results.length > 0) {
            const response = {
                result: "true",
            };
            // 성공 시 결과 응답으로 전송
            res.json(response);
        }
        else {
            // 데이터가 없는 경우
            const response = {
                result: "false",
            };
            res.json(response);
        }
    });
});
module.exports = router;