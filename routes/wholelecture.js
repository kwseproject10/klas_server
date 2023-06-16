const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query =
    "select lecYear, lecSem as semester,concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) as ID,l.lecName as title,m.majName as major,l.lecType,l.lecCre as credit,e.enCre as grade from enrollments as e join lectures as l on e.lecKey = l.lecKey join majors as m on l.majID = m.majID where e.userID = ? ORDER BY lecYear DESC, lecSem DESC";
  /*
lecYear,semester,ID,title,major,lecType,credit,grade
2023,1,H020-4-8995-1,산학협력캡스톤설계1,컴퓨터정보공학부,전선,3,NULL
2023,1,H000-1-9753-3,대학물리학1,소프트웨어융합대학,기필,3,NULL
*/

  // /wholelecture?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
      const lecInfo = {};

      results.forEach((row) => {
        const year = row.lecYear;
        const semester = row.semester;

        // 해당 연도가 userCredit에 없을 경우 초기화
        if (!lecInfo[year]) {
          lecInfo[year] = {};
        }

        if (!lecInfo[year][semester]) {
          lecInfo[year][semester] = [];
        }

        lecInfo[year][semester].push({
          ID: row.ID || null,
          title: row.title || null,
          major: row.major || null,
          type: row.lecType || null,
          credit: row.credit || null,
          grade: row.grade || null,
        });
      });

      console.log(lecInfo);

      return res.json(lecInfo);
    } else {
      console.log("wholelecture Fail");

      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
