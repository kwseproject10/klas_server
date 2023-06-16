const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

// /wholeattendance?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query =
    "select concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) ID,clWeek,clNum, case when atState = 'attend' then 1 when atState = 'late' then 0.6 when atState = 'absence' then 0 end as attend from enrollments e join lectures l on e.lecKey = l.lecKey and l.lecYear = year(curdate()) and l.lecSem = IF(MONTH(CURRENT_DATE()) <= 6, 1, 2) join classes c on l.lecKey = c.lecKey join attendances a on c.clKey = a.clKey where e.userID = ?";
  /*
ID,clWeek,clNum,attend
H020-4-0846-1,1,1,1
H020-4-0846-1,1,2,0.6
H020-4-0846-1,2,3,1
*/

  // /wholeattendance?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const attendInfo = {};

      results.forEach((row) => {
        const ID = row.ID;
        const week = row.clWeek;
        const attend = row.attend;

        if (!attendInfo[ID]) {
          attendInfo[ID] = [];
        }

        if (!attendInfo[ID][week]) {
          attendInfo[ID][week] = [];
        }

        attendInfo[ID][week].push(attend);
      });

      const modifiedAttendInfo = {};
      Object.keys(attendInfo).forEach((ID) => {
        modifiedAttendInfo[ID] = Object.values(attendInfo[ID]);
      });

      console.log(modifiedAttendInfo);

      // 성공 시 결과 응답으로 전송
      res.json(modifiedAttendInfo);
    } else {
      console.log("wholeattendance Fail");

      return res.json([]);
    }
  });
});
module.exports = router;
