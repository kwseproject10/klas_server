const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /notice?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(lectureID)) {
    userID = null;
  }

  /* [강의 ID 보내면 해당 강의의 공지사항 반환
      {
        key: "0",
        title: "중간고사 시험범위",
        subject: "소프트웨어공학",
        date: "2022.01.01(월)"
      },
      {
        key: "1",
        title: "2차 프로젝트 점수 공지",
        subject: "소프트웨어공학",
        date: "2023.05.28(일)"
      },
      {
        key: "2",
        title: "[자료] uCoS 예제소스 컴파일 시 발생하는 문제 해결방법",
        subject: "임베디드시스템S/W설계",
        date: "2022.01.01(월)"
      },
      {
        key: "3",
        title: "Assignment for INCOMPLETE PREREQUISITE",
        subject: "신호및시스템",
        date: "2022.01.01(월)"
      },
      {
        key: "4",
        title: "금일 수업 휴강 공지",
        subject: "머신러닝",
        date: "2022.01.01(월)"
      }
    ]*/
    const query =
        "";

    connection.query(query, [lectureID], (err, results) => {
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
