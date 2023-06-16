const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

// /lectureinform?lectureID=*
router.get("/", (req, res) => {
    // 쿼리 파라미터 추출
    const lectureID = req.query.lectureID;

    // Check if lectureID is NaN and set it to null
    if (lectureID === "NULL") {
        lectureID = null;
    }
    /*
    {
            "key": "0",
            "name": "머신러닝",
            "professor": "박철수",
            "major": "컴퓨터정보공학부",
            "type": "전선",
            "credit": "3",
            "numOfTime": "3",
            "time": [
                "월3",
                "수4"
            ],
            "place": [
                "새빛203",
                "새빛203"
            ],
            "ID": "H020-4-8483-01"
        }
    */
    const query =
        "";

    // /lecturelastboard?lectureID=*
    connection.query(query, [lectureID], (err, results) => {
        if (err) {
            console.error("MySQL query error: ", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (results.length > 0) {
            const time = {};
            let temp = results.time;
            let day = "";
            let num = "";
            for(let i; i < 9; i++ ){
                let part = temp.substring(i, i+1);
                if(part === "월" ||part === "화" ||part === "수" ||part === "목" ||part === "금"){
                    day = part;
                }else if(part === ","){
                }else if(part != ""){
                    num = part;
                    time.push(day + num);
                }
            }
            // 결과를 원하는 형태로 가공
            const lastList = {
                "key": "0",
                "name": results.name,
                "professor": results.professor,
                "major": results.major,
                "type": results.type,
                "credit": results.credit,
                "numOfTime": results.numOfTime,
                "time": time,
                "place": results.place,
                "ID": results.lectureID,
            };
            console.log(lastList);
            res.json(lastList);
        } else {
            console.log("lectureinform fail");
            return res.json({ result: false });
        }
    });
});

module.exports = router;
