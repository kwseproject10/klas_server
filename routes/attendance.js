const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /attendance?userID=*&lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);
  const lectureID = req.query.lectureID;

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  // 테스트용 : 2020123456, H020-4-0846-1
  const query =
    "select clWeek,clNum,case when atState='attend' then 1 when atState='late' then 0.6 when atState='absence' then 0 end as attend from enrollments e join lectures l on e.lecKey = l.lecKey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join classes c on l.lecKey = c.lecKey join attendances a on c.clKey = a.clKey where e.userID=? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=?";
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
