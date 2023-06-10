const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /wholeassignment?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* [
      {
        key: "0",
        title: "Implementation of Ripple Carry Adder using Verilog",
        subject: "디지털논리회로1",
        startDate: "2022.01.01(월)",
        endDate: "2023.12.31(월)",
        due: "3"
      },
      {
        key: "1",
        title: "3차 프로젝트",
        subject: "소프트웨어공학",
        startDate: "2023.05.10(일)",
        endDate: "2023.06.16(월)",
        due: "6"
      },
      {
        key: "2",
        title: "Term Project",
        subject: "컴퓨터네트워크",
        startDate: "2022.01.01(월)",
        endDate: "2023.12.31(월)",
        due: "6"
      },
      {
        key: "3",
        title: "Signal&System HW #5",
        subject: "신호및시스템",
        startDate: "2022.01.01(월)",
        endDate: "2023.12.31(월)",
        due: "13"
      },
      {
        key: "4",
        title: "[project]embedded system design on uCOS - final",
        subject: "임베디드시스템S/W설계",
        startDate: "2022.01.01(월)",
        endDate: "2023.12.31(월)",
        due: "20"
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
                key: index.toString(),
                title: row.title,
                subject: row.subject,
                startDate: row.startDate,
                endDate: row.endDate,
                due: row.due,
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
