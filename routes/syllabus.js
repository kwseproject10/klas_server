const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /syllabus?lectureID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const query =
    "select lecYear,lecSem semester,lecName,lecProf professor,tel professorPhone,email professorEmail,majName major,lecType,lecCre credit,lecHour numOFTime,lecTime,lecRm place,concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) ID,tbTitle,tbAuth,tbPubl,lecDesc,ratAtten,ratMid,ratFin,ratAss,ratAttit,ratQuiz,ratEtc from lectures l left join users u on l.lecProf = u.userName join majors m on l.majID = m.majID where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) = ?";
  /*
lecYear,semester,lecName,professor,professorPhone,professorEmail,major,lecType,credit,numOFTime,lecTime,place,ID,tbTitle,tbAuth,tbPubl,lecDesc,ratAtten,ratMid,ratFin,ratAss,ratAttit,ratQuiz,ratEtc
2020,2,대학영어,이종국,NULL,NULL,소프트웨어융합대학,교필,3,3,월1.수2,새빛205,H000-1-3362-1,제목,저자,출판사,"이론(짝수 주 대면)",0,0,0,0,0,0,0
2020,2,대학영어,에이미,NULL,NULL,소프트웨어융합대학,교필,3,3,월2.수1,새빛205,H000-1-3362-2,제목,저자,출판사,"이론(짝수 주 대면)",0,0,0,0,0,0,0
*/

  // /syllabus?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      const lecDetail = results.map((row, index) => {
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

        return {
          key: index.toString(),

          name: row.lecName,
          professor: row.professor,
          professorPhone: row.professorPhone,
          professorEmail: row.professorEmail,
          major: row.major,
          type: row.lecType,
          credit: row.credit,
          numOfTime: row.numOFTime,
          time: times,
          place: row.place,
          ID: row.ID,
          textBook: {
            name: row.tbTitle,
            author: row.tbAuth,
            publisher: row.tbPubl,
          },
          description: row.lecDesc,
          evaluationRatio: {
            attendance: row.ratAtten,
            midTermExam: row.ratMid,
            finalExam: row.ratFin,
            assignment: row.ratAss,
            attitude: row.ratAttit,
            quiz: row.ratQuiz,
            etc: row.ratEtc,
          },
        };
      });

      console.log(lecDetail); // 콘솔

      return res.json(lecDetail); // 성공
    } else {
      console.log("syllabus Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
