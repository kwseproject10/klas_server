const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  const userID = req.query.userID; // 사용자의 ID
  const lectureID = req.query.lectureID; // 학정번호

  // users 테이블에서 userName 가져오기
  const getUserNameQuery = "SELECT userName FROM users WHERE userID = ?";
  connection.query(getUserNameQuery, [userID], (error, userNameResult) => {
    if (error) {
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userNameResult.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    // userName
    const userName = userNameResult[0].userName;

    // lectures, users 테이블 조인하여 수업 및 사용자 정보 가져오기
    const getLectureInfoQuery = `
      SELECT l.lecKey
      FROM lectures l
      INNER JOIN users u ON l.lecName = u.userName
      WHERE l.lectureID = ? AND u.userName = ?
    `;
    connection.query(
      getLectureInfoQuery,
      [lectureID, userName],
      (error, lectureInfoResult) => {
        if (error) {
          console.error("MySQL query error: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (lectureInfoResult.length === 0) {
          return res.json({ success: false, message: "Lecture not found" });
        }

        // lecKey
        const lecKey = lectureInfoResult[0].lecKey;

        // enrollments 테이블에서 해당 강의 수강 학생들의 성적 조회
        const getGradeQuery =
          "SELECT scoMid, scoFin, enCre FROM enrollments WHERE lecKey = ?";
        connection.query(getGradeQuery, [lecKey], (error, gradeResult) => {
          if (error) {
            console.error("MySQL query error: ", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          const grades = [];
          const enKeys = gradeResult.map((row) => row.enKey);
          const enCres = gradeResult.map((row) => row.enCre);

          // submits 테이블에서 해당 enKey를 가진 행들의 smScore 합산
          const getSubmitScoreQuery =
            "SELECT smScore FROM submits WHERE enKey = ?";
          const getSubmitCountQuery =
            "SELECT COUNT(*) AS assignmentCount FROM boards WHERE lecKey = ? AND boType = 'assignment'";

          const getSubmitScorePromises = enKeys.map((enKey) => {
            return new Promise((resolve, reject) => {
              connection.query(
                getSubmitScoreQuery,
                [enKey],
                (error, submitScoreResult) => {
                  if (error) {
                    reject(error);
                  } else {
                    const totalScore = submitScoreResult.reduce(
                      (sum, row) => sum + row.smScore,
                      0
                    );
                    resolve(totalScore);
                  }
                }
              );
            });
          });

          const getSubmitCountPromise = new Promise((resolve, reject) => {
            connection.query(
              getSubmitCountQuery,
              [lecKey],
              (error, submitCountResult) => {
                if (error) {
                  reject(error);
                } else {
                  const assignmentCount =
                    submitCountResult.length > 0
                      ? submitCountResult[0].assignmentCount
                      : 0;
                  resolve(assignmentCount);
                }
              }
            );
          });

          Promise.all([...getSubmitScorePromises, getSubmitCountPromise])
            .then((results) => {
              const assignmentCount = results.pop();
              for (let i = 0; i < enKeys.length; i++) {
                const scoAss =
                  assignmentCount !== 0 ? results[i] / assignmentCount : 0;
                grades.push({ enKey: enKeys[i], enCre: enCres[i], scoAss });
              }
              return res.json({ result: "true", grades });
            })
            .catch((error) => {
              console.error("MySQL query error: ", error);
              return res.status(500).json({ error: "Internal server error" });
            });
        });
      }
    );
  });
});

module.exports = router;
