const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

/*
{
    "lectureID": lectureID,
    "notice": notice,
    "title": title,
    "cont": cont,
    "date": date,
    "poster": poster,
}
*/

// /postnotice
router.post("/", (req, res) => {
    const data = req.body;

    const query1 = "";

    connection.query(query1, [data.lectureID], (error, result1) => {
        if (error) {
            // 아예 db 접근이 안되는 경우
            console.error("MySQL query error: ", error);
            res.status(500).json({ error: "Internal server error" });

            return;
        } else {
            if (result1.length > 0) {

                hit = "0";
                type = "notice";
                const query3 =
                    "";

                connection.query(
                    query3,
                    [
                        data.lectureID,
                        notice,
                        data.title,
                        data.cont || null,
                        hit,
                        data.date,
                        data.poster,
                    ],
                    (error, result3) => {
                        if (error) {
                            console.error("MySQL 저장 실패:", error);

                            res.json({ result: false });
                        } else {
                            console.log("MySQL 저장 성공:", result3);

                            res.json({ result: true });
                        }
                    }
                );
            } else {
                console.log("존재하지 않는 강의 ID입니다.");

                res.json({ result: false });
            }
        }
    });
});

module.exports = router;
