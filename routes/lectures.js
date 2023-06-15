const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  // [유저 ID 보내면 이번 학기 수강 중인 lecture list 반환
  const query =
    "select lecName,lecProf professor,majName major,lecType,lecCre credit,lecHour numOfTime, lecTime,lecRm place,concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) as ID from enrollments e join lectures l on e.lecKey = l.lecKey and YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem join majors as m on l.majID=m.majID where e.userID = ?";
  /*
lecName,professor,major,lecType,credit,numOfTime,lecTime,place,ID
대학영어,김지희,소프트웨어융합대학,교필,3,3,금3.4,새빛205,H000-1-3362-9
대학물리및실험2,나영호,소프트웨어융합대학,기필,3,4,수2.금1.2,새빛205,H000-1-3416-3*/

  // /lectures?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const enrollInfo = results.map((row, index) => {
        let professors = row.professor ? row.professor.split(".") : [];
        let times = row.lecTime ? row.lecTime.split(".") : [];
        let places = [row.place, row.place];
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

        return {
          key: index.toString(),
          name: row.lecName || null,
          professor: professors || null,
          major: row.major || null,
          type: row.lecType || null,
          credit: row.credit.toString() || null,
          numOfTime: row.numOfTime.toString() || null,

          time: times || null,
          place: places || null,

          ID: row.ID || null,
        };
      });

      console.log(enrollInfo);

      // 성공 시 결과 응답으로 전송
      return res.json(enrollInfo);
    } else {
      console.log("lectures Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
