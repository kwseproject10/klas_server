const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /auth?userID=*&PW=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = parseInt(req.query.userID);
  const PW = req.query.PW;

  // Check if userID is NaN and set it to null
  if (isNaN(lectureID)) {
    userID = null;
  }

  /* {강의 ID 보내면 강의계획서 반환
    key: "0",
    name: "소프트웨어공학",
    professor: "이기훈",
    professorPhone: "02-940-8674",
    professorEmail: "kihoonlee@kw.ac.kr",
    major: "컴퓨터정보공학부",
    type: "전선",
    credit: "3",
    numOfTime: "3",
    time: ["월5", "수6"],
    place: "새빛205",
    ID: "H020-4-0846-01",
    textBook: {
      name: "Software Engineering 10th Edition",
      author: "Ian Sommerville",
      publisher: "Addison-Wesley"
    },
    description: "본 과정은 소프트웨어 공학에 관한 일반적인 입문 과정으로, 소프트웨어 공학의 기본 개념, methods, 실무활용 예 및 최근 기술동향 등을 소개한다.",
    evaluationRatio: {
      attendance: "10",
      midTermExam: "30",
      finalExam: "30",
      assignment: "30",
      attitude: "0",
      quiz: "0",
      etc: "0"
    }
  }*/
  const query =
    "";

  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      // 인증 성공 시 결과와 사용자 ID를 응답으로 전송
        const response = {
            key: results[0].key,
            name: results[0].name,
            professor: results[0].professor,
            professorPhone: results[0].professorPhone,
            professorEmail: results[0].professorEmail,
            major: results[0].major,
            type: results[0].type,
            credit: results[0].credit,
            numOfTime: results[0].numOfTime,
            time: results[0].time,
            place: results[0].place,
            ID: results[0].ID,
            textBook: {
                name: results[0].textBook.name,
                author: results[0].textBook.author,
                publisher: results[0].textBook.publisher
            },
            description: results[0].description,
            evaluationRatio: {
                attendance: results[0].evaluationRatio.attendance,
                midTermExam: results[0].evaluationRatio.midTermExam,
                finalExam: results[0].evaluationRatio.finalExam,
                assignment: results[0].evaluationRatio.assignment,
                attitude: results[0].evaluationRatio.attitude,
                quiz: results[0].evaluationRatio.quiz,
                etc: results[0].evaluationRatio.etc
            }
        };
        res.json(response);
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
