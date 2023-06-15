const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /assignmentnotsubmitted?userID=*&lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = req.query.userID;
  const lectureID = req.query.lectureID;

  if (userID === "NULL") {
    userID = null;
  }
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select b.boKey,boTitle title,lecName subject,asSDate startDate,asEDate endDate from enrollments e join lectures l on e.leckey = l.leckey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join boards b on l.lecKey = b.lecKey and boType = 'assignment' left join submits s on b.boKey = s.boKey and s.smDone != 1 where e.userID = ? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? order by asSDate desc";

  // /assignmentnotsubmitted?userID=*&lectureID=*
  connection.query(query, [userID, lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const assignmentInfo = results.map((row, index) => {
        const today = new Date();
        const endDate = new Date(row.endDate);
        const timeDiff = endDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
          key: row.boKey,
          title: row.title,
          subject: row.subject,
          startDate: row.startDate,
          endDate: row.endDate,
          due: daysDiff,
        };
      });

      console.log(assignmentInfo); // 콘솔

      res.json(assignmentInfo); // 성공
    } else {
      console.log("assignmentnotsubmitted Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
