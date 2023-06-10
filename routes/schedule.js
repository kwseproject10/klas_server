const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /schedule?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* {이번학기 스케쥴 반환
    key: "0",
    title: "13주차 강의",
    subject: "머신러닝",
    date: "2023.05.29(월)",
    time: "12:00"
  },
  {
    key: "1",
    title: "13주차 강의",
    subject: "신호및시스템",
    date: "2023.05.29(월)",
    time: "13:30"
  },
  {
    key: "2",
    title: "13주차 강의(온라인)",
    subject: "임베디드시스템S/W설계",
    date: "2023.05.29(월)",
    time: "15:00"
  },
  {
    key: "3",
    title: "13주차 강의",
    subject: "소프트웨어공학",
    date: "2023.05.29(월)",
    time: "16:30"
  },
  {
    key: "4",
    title: "[과제] 3차 프로젝트",
    subject: "소프트웨어공학",
    date: "2023.05.30(화)",
    time: "23:59"
  }*/
    const query =
        "";

    connection.query(query, [userID], (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
    
        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          const formattedResults = results.map((row, index) => {
            return {
                key: index.toString(),
                title: row.title,
                subject: row.subject,
                date: row.date,
                time: row.time,
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
