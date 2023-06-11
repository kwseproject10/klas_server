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
    "select su.subjectName,l.lecProfessor,u.phone,u.email,m.majorName,l.category,l.credit,l.lecHour,l.lecTime,l.place,concat(l.majorID,'-',l.lecLevel,'-',l.subjectID,'-',l.class) as ID,t.title,t.author,t.publisher,sy.lecDescription,sy.attendanceRatio,sy.midtermRatio,sy.finalRatio,sy.assignmentRatio,sy.attitudeRatio,sy.quizRatio,sy.etcRatio from lectures as l left join subjects as su on l.subjectID = su.subjectID left join users as u on l.lecProfessor= u.userName left join majors as m on l.majorID = m.majorID left join syllabi as sy on sy.lecKey = l.lecKey left join textbooks as t on t.lecKey = l.lecKey where concat(l.majorID,'-',l.lecLevel,'-',l.subjectID,'-',l.class) = ?;";
  /*
subjectName,lecProfessor,phone,email,majorName,category,credit,lecHour,lecTime,place,ID,title,author,publisher,lecDescription,attendanceRatio,midtermRatio,finalRatio,assignmentRatio,attitudeRatio,quizRatio,etcRatio
융합적사고와글쓰기,허연실,010-0000-0000,kwu@kw.ac.kr,소프트웨어융합대학,교필,3,3,월1.수2,NULL,H000-1-3095-1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
융합적사고와글쓰기,박상현,010-0000-0000,kwu@kw.ac.kr,소프트웨어융합대학,교필,3,3,월1.수2,NULL,H000-1-3095-1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
*/ // 이거 연도별로 구분안하면 이렇게 2개 올 수 도 있음

  // /syllabus?lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송

      const lecDetail = results.map((row, index) => {
        let times = row.lecTime ? row.lecTime.split(".") : [];

        return {
          key: index.toString(),
          name: row.subjectName,
          professor: row.lecProfessor,
          professorPhone: row.phone,
          professorEmail: row.email,
          major: row.majorName,
          type: row.category,
          credit: row.credit,
          numOfTime: row.lecHour,
          time: times,
          place: row.place,
          ID: row.ID,
          textBook: {
            name: row.title,
            author: row.author,
            publisher: row.publisher,
          },
          description: row.lecDescription,
          evaluationRatio: {
            attendance: row.attendanceRatio,
            midTermExam: row.midtermRatio,
            finalExam: row.finalRatio,
            assignment: row.assignmentRatio,
            attitude: row.attitudeRatio,
            quiz: row.quizRatio,
            etc: row.etcRatio,
          },
        };
      });

      console.log(lecDetail);

      // 성공 시 결과 응답으로 전송
      return res.json(lecDetail);
    } else {
      // 강의 찾기 실패
      const response = {
        result: "false",
      };

      res.json(response);
    }
  });
});

module.exports = router;
