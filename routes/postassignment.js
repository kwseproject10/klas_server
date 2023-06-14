const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /postnotice
router.post("/", (req, res) => {

    const data = req.body;

    /* 과제 작성*/
    const query =
        "";

    connection.query(query, data, (err, results) => {
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