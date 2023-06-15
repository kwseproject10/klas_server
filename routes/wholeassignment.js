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

  const query =
    "select boKey,boTitle title,lecName subject,asSDate startDate,asEDate endDate,boHit hit from enrollments e join lectures l on e.leckey = l.leckey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join boards b on l.lecKey = b.lecKey and b.boType = 'notice' where botype = 'assignment' and e.userID = ? order by boFDate desc";
  /*
title,subject,startDate,endDate,due
*/

  // /wholeassignment?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const today = new Date();
      const timeDiff = new Date(results[0].endDate).getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      // 결과를 원하는 형태로 가공
      const assignmentInfo = results.map((row, index) => {
        return {
          key: row.boKey,
          title: row.title,
          subject: row.subject,
          startDate: row.startDate,
          endDate: row.endDate,
          hit: row.hit,
          due: daysDiff,
        };
      });

      console.log(assignmentInfo); // 콘솔

      res.json(assignmentInfo); // 성공
    } else {
      console.log("wholeassignment Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
