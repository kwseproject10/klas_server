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
