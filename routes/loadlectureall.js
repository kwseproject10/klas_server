const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /loadlectureall
router.get("/", (req, res) => {
  // MySQL 쿼리를 사용하여 전체 강의 목록 읽어오기
  const query =
    "SELECT * FROM lectures as l, subjects as s, majors as m where l.subjectID=s.subjectID and l.majorID = m.majorID;";
  // lecKey,majorID,lecLevel,subjectID,class,category,credit,lecHour,lecProfessor,lecTime,lecYear,semester,place,subjectID,subjectName,majorID,majorName
  // 32,H020,1,0019,1,교필,3,3,유지현,월3.수4,2023,1,NULL,0019,C프로그래밍,H020,컴퓨터정보공학부

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
          ID: `${row.majorID}-${row.lecLevel}-${row.subjectID}-${row.class}`,
          name: row.subjectName,
          major: row.majorName,
          type: row.category,
          credit: row.credit,
          numOfTime: row.lecHour,
          professor: row.lecProfessor.replace(".", ","),
          time: row.lecTime.replace(".", ","),
          place: row.place,
        };
      });

      console.log(lecInfo);

      // 성공 시 결과 응답으로 전송
      return res.json(lecInfo);
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
