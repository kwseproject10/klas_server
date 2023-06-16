const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /lecturelastboard?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query = `
  SELECT DISTINCT b.boKey, b.boTitle, b.boType, b.boFDate 
  FROM lectures l
  JOIN boards b ON l.lecKey = b.lecKey
  INNER JOIN (
      SELECT boType, MAX(boFDate) AS maxDate 
      FROM boards 
      GROUP BY boType
  ) sub ON b.boType = sub.boType AND b.boFDate = sub.maxDate 
  WHERE  concat(l.majID, '-', l.lecLv, '-', l.subID, '-', l.clsNum) = ?
  order by case b.boType
  when 'notice' then 1
  when 'download' then 2
  when 'assignment' then 3
  end
    `;

  // /lecturelastboard?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error", details: err });
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

      return res.status(404).json({ error: "No results found" });
    }
  });
});

module.exports = router;
