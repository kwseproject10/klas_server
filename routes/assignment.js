const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /assignment?lectureID=*
router.get("/", (req, res) => {
  const lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select boKey,boTitle title, lecName subject,asSDate startDate, asEDate endDate from lectures l join boards b on l.lecKey = b.lecKey and boType = 'assignment' where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=?";
  /*
title,subject,date
NULL,대학영어,NULL
NULL,대학영어,NULL
*/

  // /assignment?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const today = new Date();
      const timeDiff = row.endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      // 결과를 원하는 형태로 가공
      const noticeList = results.map((row, index) => {
        return {
          key: row.boKey,
          title: row.title,
          subject: row.subject,
          startDate: row.startDate,
          endDate: row.endDate,
          due: daysDiff,
        };
      });

      console.log(noticeList);

      res.json(noticeList);
    } else {
      console.log("assignmnet Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
