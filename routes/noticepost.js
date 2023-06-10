const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /auth?userID=*&PW=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
    const lectureID = req.query.lectureID;

    // Check if lectureID is NaN and set it to null
    if (lectureID === "NULL") {
        lectureID = null;
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
            name: results[0].name,
            poster: results[0].poser,
            postDate: results[0].postDate,
            postHit: results[0].postHit,
            postfileURL: results[0].postfileURL,
            postText: results[0].postText,
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