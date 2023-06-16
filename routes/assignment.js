const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /assignment?lectureID=*
router.get("/", (req, res) => {
  let lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select b.boKey,boTitle title, lecName subject,asSDate startDate, asEDate endDate ,smDone from lectures l join boards b on l.lecKey = b.lecKey and boType = 'assignment' join submits s on b.boKey = s.boKey where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=?";

  // /assignment?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    console.log(results);

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const noticeList = results.map((row, index) => {
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
          state: row.smDone === null ? 0 : 1,
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
