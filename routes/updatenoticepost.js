const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /updatenoticepost
router.post("/", (req, res) => {
    const noticeID = {
        name: req.body.lectureID,
    }
    const notice = req.body;

    /* 공지사항 게시물 작성
공지사항 ID로 공지사항이 있는지 확인????*/
    const query1 =
        "";

    connection.query(query1, noticeID, (err, results) => {
        if (err) {
            console.error("MySQL query error: ", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (results.length > 0) {
            //수정된 데이터 전송
            const query2 =
                "";


            connection.query(query2, notice, (err, results) => {
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
                else {//실패 시
                    const response = {
                        result: "false",
                    };
                    res.json(response);
                }
            })
        }
        else {
            // 공지사항이 없는 경우
            const response = {
                result: "false",
            };
            res.json(response);
        }
    });
});
module.exports = router;