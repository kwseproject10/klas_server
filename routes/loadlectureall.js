const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /loadlectureall
router.get("/", (req, res) => {
  // MySQL 쿼리를 사용하여 전체 강의 목록 읽어오기
  const query =
    "SELECT concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) as ID,lecName,m.majName,lecType,lecCre,lecHour,lecProf,lecTime,lecRm FROM lectures as l, majors as m where l.majID = m.majID and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem";
  /*
ID,lecName,majName,lecType,lecCre,lecHour,lecProf,lecTime,lecRm
H000-1-3362-1,대학영어,소프트웨어융합대학,교필,3,3,이종국,월1.수2,새빛205
H000-1-3362-2,대학영어,소프트웨어융합대학,교필,3,3,에이미,월2.수1,새빛205
*/

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
