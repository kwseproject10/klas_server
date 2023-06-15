const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /enrolllecture?userID=*&lectureID=*
router.get("/", (req, res) => {
  const userID = req.query.userID;
  const lectureID = req.query.lectureID;

  if (userID === "NULL") {
    userID = null;
  }
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query1 =
    "SELECT * FROM enrollments e join lectures l on e.lecKey = l.lecKey where userID=? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=?";

  connection.query(query1, [userID, lectureID], (err, result1) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result1.length > 0) {
      console.log("이미 수강신청된 강의임");

      return res.json({ result: false });
    } else {
      const query2 =
        "select lecTime from enrollments e join lectures l on e.lecKey = l.lecKey where e.userID=? and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem";

      connection.query(query2, [userID], (err, result2) => {
        if (err) {
          console.error("MySQL query error: ", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const timeInfo = result2.map((row) => {
          let times = row.lecTime ? row.lecTime.split(".") : [];
          let weekday;
          for (let i = 0; i < times.length; i++) {
            if (
              times[i].charAt(0) === "월" ||
              times[i].charAt(0) === "화" ||
              times[i].charAt(0) === "수" ||
              times[i].charAt(0) === "목" ||
              times[i].charAt(0) === "금" ||
              times[i].charAt(0) === "토"
            ) {
              weekday = times[i].charAt(0);
            } else {
              times[i] = weekday + times[i];
            }
          }
        });

        if (result2.length > 0) {
        } else {
          console.log("수강신청했던 강의가 없네요");
        }
      });
    }
  });

  const query =
    "SELECT concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) as ID,lecName,m.majName,lecType,lecCre,lecHour,lecProf,lecTime,lecRm FROM lectures as l, majors as m where l.majID = m.majID and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem";

  // /loadlectureall
  connection.query(query, (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const lecInfo = results.map((row, index) => {
        return {
          key: index.toString(),
          ID: row.ID || null,
          name: row.lecName || null,
          major: row.majName || null,
          type: row.lecType || null,
          credit: row.lecCre || null,
          numOfTime: row.lecHour || null,
          professor:
            row.lecProf !== null ? row.lecProf.replace(".", ",") : null,
          time: row.lecTime !== null ? row.lecTime.replace(".", ",") : null,
          place: row.lecRm || null,
        };
      });

      console.log(lecInfo);

      // 성공 시 결과 응답으로 전송
      return res.json(lecInfo);
    } else {
      console.log("loadlectureall Fail");

      return res.json([]);
    }
  });
});
module.exports = router;
