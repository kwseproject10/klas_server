const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /attendance?userID=*&lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const lectureID = req.query.lectureID;

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  /*[유저 ID와 강의 ID 보내면 해당 유저의 해당 강의 출석 현황 반환 -> 강의 출석 현황을 배열로 보내야함
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
]*/
  const query =
    "";

  connection.query(query, [userID, lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const response = results.attendance;
      res.json(response);
    } else {
      // 로그인 실패
      const response = {
        result: "false",
      };
      res.json(response);
    }
  });
});

module.exports = router;
