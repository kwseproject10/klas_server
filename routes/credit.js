const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /schedule?userID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* {유저 ID 보내면 각 학기별 학점 및 평점, 졸업 요구 학점 반환
	"userCredit" : {
    "2023": {
      "1": {
        "major": 15,
        "general": 0,
        "etc": 0,
        "total": 15,
        "GPA": -1
      }
    },
    "2022": {
      "2": {
        "major": 18,
        "general": 0,
        "etc": 0,
        "total": 18,
        "GPA": 4.1
      },
      "1": {
        "major": 17,
        "general": 0,
        "etc": 0,
        "total": 17,
        "GPA": 4.0
      }
    },
    "2021": {
      "2": {
        "major": 18,
        "general": 0,
        "etc": 0,
        "total": 18,
        "GPA": 4.0
      },
      "1": {
        "major": 15,
        "general": 6,
        "etc": 0,
        "total": 21,
        "GPA": 4.0
      }
    },
    "2020": {
      "2": {
        "major": 9,
        "general": 16,
        "etc": 0,
        "total": 25,
        "GPA": 4.0
      },
      "1": {
        "major": 6,
        "general": 13,
        "etc": 0,
        "total": 19,
        "GPA": 4.0
      }
    }
  },
  "creditForGrad" : {
      "major" : 39,
      "general" : 40,
      "etc" : 0,
      "total" : 130
  }
}*/
    const query =
        "";

    connection.query(query, (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
    
        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          
          const formattedResults = results.map((row, index) => {
            return {
            };
          });
          // 성공 시 결과 응답으로 전송
          res.json(formattedResults);
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