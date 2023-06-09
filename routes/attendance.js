const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /attendance?userID=*&lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let userID = req.query.userID;
  let lectureID = req.query.lectureID;

  // Check if userID is NaN and set it to null
  if (userID === "NULL") {
    userID = null;
  }

  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  // 테스트용 : 2020123456, H020-4-0846-01
  const query =
    "select DISTINCT c.clKey,clWeek,clNum, case when atState='attend' then 1 when atState='late' then 0.6 when atState='absence' then 0 end attend from enrollments e join lectures l on e.lecKey = l.lecKey join classes c on l.lecKey = c.lecKey join attendances a on e.enKey = a.enKey and c.clKey = a.clKey inner join enrollments e2 on e.userID = e2.userID where YEAR(NOW()) = l.lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = l.lecSem and e.userID=? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? ";
  /*
clWeek,clNum,attend
1,1,1
1,2,0.6*/

  // /attendance?userID=*&lectureID=*
  connection.query(query, [userID, lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const attendInfo = [];

      results.forEach((row) => {
        const week = row.clWeek;

        if (!attendInfo[week]) {
          attendInfo[week] = [];
        }

        attendInfo[week].push(row.attend);
      });

      const modifiedAttendInfo = Object.values(attendInfo).filter(Boolean);

      console.log(modifiedAttendInfo);
      res.json(modifiedAttendInfo);
    } else {
      console.log("attendance Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
