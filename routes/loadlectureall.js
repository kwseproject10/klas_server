const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /loadlectureall
router.get("/", (req, res) => {
  // MySQL 쿼리를 사용하여 전체 강의 목록 읽어오기
  const query =
    "SELECT * FROM lectures as l, subjects as s, majors as m where l.subjectID=s.subjectID and l.majorID = m.majorID;";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const formattedResults = results.map((row, index) => {
        return {
          key: index.toString(),
          ID: `${row.majorID}-${row.lecLevel}-${row.subjectID}-${row.class}`,
          name: row.subjectName,
          major: row.majorName,
          type: row.category,
          credit: row.credit,
          numOfTime: row.lecHour,
          professor: row.lecProfessor,
          time: row.lecTime.replace(".", ","),
          place: row.place,
        };
      });
      // 성공 시 결과 응답으로 전송
      return res.json(formattedResults);
    } else {
      // 데이터가 없는 경우
      return res.json({ result: [] });
    }
  });
});
module.exports = router;
