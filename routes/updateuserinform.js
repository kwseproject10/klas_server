const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /signup
router.post("/", (req, res) => {
  // 쿼리 파라미터 추출
    const userinform = req.body;

  /* 유저 개인 정보 수정*/
    const query =
        "";

    connection.query(query, [userinform], (err, results) => {
        if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
    
        if (results.length > 0) {
          // 결과를 원하는 형태로 가공
          const response = {
            result: "true",
          };
          // 성공 시 결과 응답으로 전송
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
