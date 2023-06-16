const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

// /lecturelastboard?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "SELECT distinct b.boKey,b.boTitle, b.boType, b.boFDate FROM lectures l join boards b INNER JOIN (SELECT boType, MAX(boFDate) AS maxDate FROM boards GROUP BY boType) sub ON b.boType = sub.boType AND b.boFDate = sub.maxDate where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) = ?";

  // /lecturelastboard?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const lastList = results.map((row, index) => {
        return {
          key: row.boKey,
          title: row.boTitle,
          type: row.boType,
        };
      });

      console.log(lastList);

      res.json(lastList);
    } else {
      console.log("notice Fail");

      return res.json({ result: false });
    }
  });
});

module.exports = router;
