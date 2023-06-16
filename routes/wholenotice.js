const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query =
    "select boKey,boTitle title,lecName subject,boFDate date,boHit hit from enrollments e join lectures l on e.leckey = l.leckey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join boards b on l.lecKey = b.lecKey and b.boType = 'notice' where botype = 'notice' and e.userID = ? order by boFDate desc";
  /*
boKey,title,subject,date,hit
1,"Zoom 링크",소프트웨어공학,"2023-04-28 12:13:00",38
*/

  // /wholenotice?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const noticeInfo = results.map((row, index) => {
        return {
          key: row.boKey || null,
          title: row.title || null,
          subject: row.subject || null,
          date: row.date || null,
          hit: row.hit || null,
        };
      });

      console.log(noticeInfo);

      res.json(noticeInfo);
    } else {
      console.log("wholenotice Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
