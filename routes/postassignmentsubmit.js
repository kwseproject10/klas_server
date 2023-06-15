const express = require("express");
const router = express.Router();
const multer = require("multer");
const connection = require("../modules/mysql");

const upload = multer({ dest: 'uploads/' });

// /postassignmentsubmit
router.post("/", upload.single('file'),(req, res) => {
    const file = req.file;
    const data = req.body;
    
    const values = [file.originalname, file.path];
    /* 과제 제출*/
    const query =
        "";

    connection.query(query, values, (err, results) => {
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