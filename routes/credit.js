const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /credit?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query1 =
    "select l.lecYear,l.semester,l.category,e.credit as uCredit,l.credit as lecCredit from  enrollments as e join lectures as l on e.lecKey=l.lecKey join users as u on u.userID = e.studentID where u.userID = ?;";

  const query2 =
    "select distinct g.majorCredit,g.wholeCredit from users as u join majors as m on u.majorID = m.majorID join gradreqs as g on g.majorID = m.majorID where u.userID = ?;";

  let creditForGrad = {
    major: 0,
    general: 0,
    etc: 0,
    total: 0,
  };

  connection.query(query1, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const userCredit = {};
      const semesterCount = {};

      results.forEach((row) => {
        const year = row.lecYear;
        const semester = row.semester;

        // 해당 연도가 userCredit에 없을 경우 초기화
        if (!userCredit[year]) {
          userCredit[year] = {};
        }

        // Initialize semesterCount[year] if not present
        if (!semesterCount[year]) {
          semesterCount[year] = {};
        }

        // 해당 학기가 userCredit[year]에 없을 경우 초기화
        if (!userCredit[year][semester]) {
          userCredit[year][semester] = {
            major: 0,
            general: 0,
            etc: 0,
            total: 0,
            GPA: -1,
          };
          semesterCount[year][semester] = 1;
        } else {
          semesterCount[year][semester]++;
        }

        // 학점 정보 계산
        if (row.category.charAt(0) === "전") {
          // 전공 학점
          userCredit[year][semester].major += row.lecCredit || 0;
          userCredit[year][semester].total += row.lecCredit || 0;
          userCredit[year][semester].GPA += row.uCredit || 0;
        } else if (row.category.charAt(0) === "교") {
          // 교양 학점
          userCredit[year][semester].general += row.lecCredit || 0;
          userCredit[year][semester].total += row.lecCredit || 0;
          userCredit[year][semester].GPA += row.uCredit || 0;
        } else {
          userCredit[year][semester].etc += row.lecCredit || 0;
          userCredit[year][semester].total += row.lecCredit || 0;
          userCredit[year][semester].GPA += row.uCredit || 0;
        }
      });

      // Calculate average GPA for each semester
      for (const year in userCredit) {
        for (const semester in userCredit[year]) {
          if (userCredit[year][semester].GPA === -1) {
            userCredit[year][semester].GPA = -1;
          } else if (semesterCount[year][semester] >= 0) {
            userCredit[year][semester].GPA =
              Math.round(
                (userCredit[year][semester].GPA /
                  semesterCount[year][semester]) *
                  10
              ) / 10;
          } else {
            userCredit[year][semester].GPA = 0;
          }
        }
      }

      connection.query(query2, [userID], (err, results2) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        if (results2.length > 0) {
          creditForGrad = {
            major: results2[0].majorCredit,
            general: 0,
            etc: 0,
            total: results2[0].wholeCredit,
          };
        }
      });

      console.log("userCredit: ", userCredit);
      console.log(semesterCount);
      console.log("creditForGrad: ", creditForGrad);
      // 성공 시 결과 응답으로 전송

      const response = {
        userCredit: userCredit,
        creditForGrad: creditForGrad,
      };

      res.json(response);
    } else {
      // 데이터가 없는 경우
      const response = {
        result: "false",
      };
      res.json(response);
    }
  });
});
module.exports = router;
