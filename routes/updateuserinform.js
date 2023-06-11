const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /signup
router.post("/", (req, res) => {

    const userID = {
        studentID: req.body.studentID,
    }
    const userinform = req.body;

    /*유저 개인정보 수정을 위한 유저ID 체크*/
    const query1 =
        "";

    connection.query(query, userID, (err, results) => {
        if (err) {
            console.error("MySQL query error: ", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (results.length > 0) {
            /*유저의 새로운 정보 보냄*/
            const query2 =
                "";

            connection.query(query2, userinform, (err, results) => {
                if (err) {
                    console.error("MySQL query error: ", err);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }

                if (results.length > 0) {
                    // 결과를 원하는 형태로 가공
                    const response = {
                        result: "true",
                    };
                    // 성공 시 결과 응답으로 전송
                    res.json(response);
                } else {
                    // 데이터가 없는 경우
                    const response = {
                        result: "false",
                    };
                    res.json(response);
                }
            });
        }
        else {
            const response = {
                result: "false",
            };
            // 성공 시 결과 응답으로 전송
            res.json(response);
        }
    });
});
module.exports = router;