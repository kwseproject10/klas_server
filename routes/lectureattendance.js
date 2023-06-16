const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

// /lectureattendance?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;

  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  // 테스트용 : H020-4-0846-01
  const query =
    "select c.clKey, c.clWeek, c.clNum, c.clDate, atState from lectures l left join classes c on c.lecKey = l.lecKey left join attendances a on c.clKey = a.clKey where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? and l.lecYear=2023 order by c.clKey asc";

  // /lectureattendance?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      let arr = []
      let temp = 0;
      let dayCount = 0;

      results.forEach((row, iter) => {
        const classID = row.clKey;
        const week = row.clWeek;
        const num = row.clNum;
        const date = row.clDate;
        const state = row.atState;
      
        if (iter && arr[arr.length - 1].classWeek !== week) {
          dayCount = 0;
        }
        dayCount++;
      
        if (arr.length === 0 || arr[arr.length - 1].classID !== classID) {
          arr.push({
            classID: classID,
            classDate: date,
            classWeek: week,
            classDay: dayCount,
            numOfAtt: 0,
            numOfAbs: 0,
            numOflat: 0,
          });
        }
      
        switch (state) {
          case "attend":
            arr[arr.length - 1].numOfAtt++;
            break;
          case "absence":
            arr[arr.length - 1].numOfAbs++;
            break;
          case "late":
            arr[arr.length - 1].numOflat++;
            break;
          default:
            break;
        }
      });
      console.log(arr);
      res.json(arr);
    } else {
      console.log("attendance Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
