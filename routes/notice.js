const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /notice?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select boKey, boTitle title, lecName subject,boFDate date ,boHit hit, boPoster poster from lectures l join boards b on l.lecKey = b.lecKey and boType = 'notice' where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? order by date desc";
  /*
boKey,title,subject,date,hit,poster
1,"Zoom 링크",소프트웨어공학,"2023-04-28 12:13:00",38,김상호
2,"중간고사 및 기말고사 일정",소프트웨어공학,"2023-04-03 15:20:00",37,김상호
3,"핀테크 산학협력 인턴십 과정 안내",소프트웨어공학,"2023-06-07 11:47:00",26,김상호
*/

  // /notice?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const noticeList = results.map((row, index) => {
        return {
          key: row.boKey,
          title: row.title,
          subject: row.subject,
          date: row.date,
          hit: row.hit,
          poster: row.poster,
        };
      });

      console.log(noticeList);

      res.json(noticeList);
    } else {
      console.log("notice Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
