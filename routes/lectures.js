const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /lectures?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  // [유저 ID 보내면 이번 학기 수강 중인 lecture list 반환
  const query =
    "select l.majorID,l.lecLevel,l.subjectID,l.class,s.subjectName as lecName,l.lecProfessor as professor,m.majorName as major,l.category as lecType,l.credit,l.lecHour as numofTime,l.lecTime,l.place from enrollments as e join lectures as l on e.lecKey = l.lecKey join subjects as s on l.subjectID = s.subjectID join majors as m on l.majorID=m.majorID where e.studentID = 2017202030;";
  // majorID,lecLevel,subjectID,class,lecName,professor,major,lecType,credit,numofTime,lecTime,place
  // H020,4,8995,1,산학협력캡스톤설계1,이형근,컴퓨터정보공학부,전선,3,3,화6.목5,NULL

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const enrollInfo = results.map((row, index) => {
        let professors = row.place ? row.place.split(".") : [];
        let times = row.lecTime ? row.lecTime.split(".") : [];

        return {
          key: index.toString(),
          name: row.lecName,
          professor: professors,
          major: row.major,
          type: row.lecType,
          credit: row.credit.toString(),
          numOfTime: row.numofTime.toString(),

          time: times,
          place: row.place,

          ID: `${row.majorID}-${row.lecLevel}-${row.subjectID}-${row.class}`,
        };
      });

      console.log(enrollInfo);

      // 성공 시 결과 응답으로 전송
      return res.json(enrollInfo);
    } else {
      // 데이터가 없는 경우
      const response = {
        result: "false",
      };

      return res.json(response);
    }
  });
});
module.exports = router;
