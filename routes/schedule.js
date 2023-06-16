const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const dateNum = {
    "일": 0,
    "월": 1,
    "화": 2,
    "수": 3,
    "목": 4,
    "금": 5,
    "토": 6,
  }
  const timeConv = {
    1: "09:00",
    2: "10:30",
    3: "12:00",
    4: "13:30",
    5: "15:00",
    6: "16:30",
  }

  let temp = new Date(2023, 2, 5);

  let enddate1 = new Date(2023, 5, 15);
  let enddate2 = new Date(2023, 11, 15);

  const line = {};

  const query = "";

  // /schedule?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const formattedResults = {};
      var length = 0;
      var index = 0;
      results.forEach((row) => {
        for (let i = 1; i < 9; i++) {
          let part = results.day.substring(i, i + 1);
          if (part != "") {
            line.push(part);
            length++;
          }
        }
        temp.setDate(2023, 2, 5);
        for (; temp != enddate1 && temp != enddate2;) {
          let day = "";
          let time = "";
          for (let i = 0; i < length; i++) {
            if (line[i] === "월" || line[i] === "화" || line[i] === "수" || line[i] === "목" || line[i] === "금") {
              day = line[i];
              time = "";
            }
            else if(line[i] != ','){
              time = line[i];
              if (temp.getDay() === dateNum(day)) {
                formattedResults.push({
                  'key': index.toString(),
                  'title': row.title,
                  'subject': row.subject,
                  'date': temp.getDate().toString(),
                  'time': timeConv(time),
                });
                index++;
              }
            }
          }
          temp.setDate(temp.getDate() + 1);
        }
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
