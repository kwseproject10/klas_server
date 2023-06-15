const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  const query1 =
    "select creMaj,creGen,creEtc,creTot from users u join majors m on u.majID = m.majID where userID = ?";
  /*
creMaj,creGen,creEtc,creTot
60,0,0,133
*/

  const query2 =
    "select l.lecYear,l.lecSem as semester,l.lecType,l.lecCre,e.enCre from enrollments as e join lectures as l on e.lecKey = l.lecKey where e.userID = ? order by l.lecYear desc, l.lecSem desc";
  /*
lecYear,semester,lecType,lecCre,enCre
2020,2,교필,3,A+
2020,2,기필,3,A+
2020,2,기필,3,A
*/

  // /credit?userID=*
  connection.query(query1, [userID], (err, results1) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results1.length > 0) {
      creditForGrad = {
        major: results1[0].creMaj,
        general: results1[0].creGen,
        etc: results1[0].creEtc,
        total: results1[0].creTot,
      };

      connection.query(query2, [userID], (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        const userCredit = {};
        const semesterCount = {};

        if (results.length > 0) {
          results.forEach((row) => {
            const year = row.lecYear;
            const semester = row.semester;
            let uCre = 0;
            let gpaCre = 0;

            if (row.lecCre === null) {
              uCre = null;
            } else if (row.lecCre === 3) {
              if (row.enCre === "A+") {
                uCre = 4.5;
                gpaCre = 4.5;
              } else if (row.enCre === "A") {
                uCre = 4;
                gpaCre = 4;
              } else if (row.enCre === "B+") {
                uCre = 3.5;
                gpaCre = 3.5;
              } else if (row.enCre === "B") {
                uCre = 3;
                gpaCre = 3;
              } else if (row.enCre === "C+") {
                uCre = 2.5;
                gpaCre = 2.5;
              } else if (row.enCre === "C") {
                uCre = 2;
                gpaCre = 2;
              } else if (row.enCre === "D+") {
                uCre = 1.5;
                gpaCre = 1.5;
              } else if (row.enCre === "D") {
                uCre = 1;
                gpaCre = 1;
              } else if (row.enCre === "F") {
                uCre = 0;
                gpaCre = 0;
              }
            } else if (row.lecCre === 1) {
              if (row.enCre === "A+") {
                uCre = 1.5;
                gpaCre = 4.5;
              } else if (row.enCre === "A") {
                uCre = 1.5;
                gpaCre = 4;
              } else if (row.enCre === "B+") {
                uCre = 1;
                gpaCre = 3.5;
              } else if (row.enCre === "B") {
                uCre = 1;
                gpaCre = 3;
              } else if (row.enCre === "C+") {
                uCre = 1;
                gpaCre = 2.5;
              } else if (row.enCre === "C") {
                uCre = 0.5;
                gpaCre = 2;
              } else if (row.enCre === "D+") {
                uCre = 0.5;
                gpaCre = 1.5;
              } else if (row.enCre === "D") {
                uCre = 0.5;
                gpaCre = 1;
              } else if (row.enCre === "F") {
                uCre = 0;
                gpaCre = 0;
              }
            }

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
            if (row.lecType.charAt(0) === "전") {
              // 전공 학점
              userCredit[year][semester].major += uCre || 0;
              userCredit[year][semester].total += uCre || 0;
              userCredit[year][semester].GPA += gpaCre || 0;
            } else if (
              row.lecType.charAt(0) === "교" ||
              row.lecType.charAt(0) === "기"
            ) {
              // 교양 학점
              userCredit[year][semester].general += uCre || 0;
              userCredit[year][semester].total += uCre || 0;
              userCredit[year][semester].GPA += gpaCre || 0;
            } else {
              userCredit[year][semester].etc += uCre || 0;
              userCredit[year][semester].total += uCre || 0;
              userCredit[year][semester].GPA += gpaCre || 0;
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

          // 성공 시 결과 응답으로 전송
          const success = {
            userCredit: userCredit,
            creditForGrad: creditForGrad,
          };

          console.log(success);

          return res.json(success);
        } else {
          console.log("credit Fail : No Data");

          return res.json([]);
        }
      });
    } else {
      console.log("credit Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
