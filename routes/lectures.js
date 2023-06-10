const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /lectures?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /*[유저 ID 보내면 이번 학기 수강 중인 lecture list 반환
    {
        "key": "0",
        "name": "소프트웨어공학",
        "professor": "이기훈",
        "major": "컴퓨터정보공학부",
        "type": "전선",
        "credit": "3",
        "numOfTime": "3",
        "time": [
            "월5",
            "수6"
        ],
        "place": [
            "새빛205",
            "새빛205"
        ],
        "ID": "H020-4-0846-01"
    },
    {
        "key": "0",
        "name": "디지털논리회로1",
        "professor": "유지현",
        "major": "컴퓨터정보공학부",
        "type": "전필",
        "credit": "3",
        "numOfTime": "3",
        "time": [
            "금5",
            "금6"
        ],
        "place": [
            "새빛203",
            "새빛203"
        ],
        "ID": "H020-2-0453-01"
    },
    {
        "key": "0",
        "name": "신호및시스템",
        "professor": "이성원",
        "major": "컴퓨터정보공학부",
        "type": "전선",
        "credit": "3",
        "numOfTime": "3",
        "time": [
            "월4",
            "수3"
        ],
        "place": [
            "새빛102",
            "새빛102"
        ],
        "ID": "H020-3-2004-01"
    },
    {
        "key": "0",
        "name": "임베디드시스템S/W설계",
        "professor": "김태석",
        "major": "컴퓨터정보공학부",
        "type": "전선",
        "credit": "3",
        "numOfTime": "3",
        "time": [
            "월6",
            "수5"
        ],
        "place": [
            "새빛205",
            "새빛205"
        ],
        "ID": "H020-4-5861-01"
    },
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
]*/
    const query =
        "";

    connection.query(query, (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
    
        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          const formattedResults = results.map((row, index) => {
            return {
            key: row.key,
            name: row.name,
            professor: row.professor,
            major: row.major,
            type: row.type,
            credit: row.credit,
            numOfTime: row.numberOfTime,
            time: [
                row.time
            ],
            place: [
                row.place
            ],
            ID: row.ID,
            };
          });
          // 성공 시 결과 응답으로 전송
          res.json(formattedResults);
        } else {
          // 데이터가 없는 경우
          const response = {
            result: "false",
          };
          res.json(response);
        }
    });
});
module.exports = router;
