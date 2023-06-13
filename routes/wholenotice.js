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

  const query =
    "select boTitle, lecName, boFDate from enrollments e join lectures l on e.leckey = l.leckey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join boards b on l.lecKey = b.lecKey and b.boType = 'notice' where  e.userID = ?;";
  /*
boTitle,lecName,boFDate
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
          key: index.toString(),
          title: row.title || null,
          subject: row.lecName || null,
          date: row.noticeDate || null,
        };
      });

      console.log(noticeInfo);

      res.json(noticeInfo);
    } else {
      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
