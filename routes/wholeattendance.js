const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /wholeattendance?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* {유저 ID 보내면 이번 학기 수강 중인 lecture들의 attendance 반환
    "H020-4-0846-01": [
        [
            1,
            0
        ],
        [
            1,
            1
        ],
        [
            0,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ]
    ],
    "H020-2-0453-01": [
        [
            1
        ],
        [
            0.6
        ],
        [
            1
        ],
        [
            1
        ],
        [
            0
        ],
        [
            1
        ],
        [
            1
        ],
        [
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            1,
            1
        ],
        [
            0,
            1,
            1
        ],
        [
            1,
            1
        ]
    ]*/
    const query =
        "";

    connection.query(query, [userID],(err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
    
        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          const formattedResults = results.map((row, index) => {
            return {
                [row.lectureID]: row.attendance,
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
